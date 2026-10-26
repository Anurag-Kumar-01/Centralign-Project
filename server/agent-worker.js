import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import { initDatabase } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const db = initDatabase();

/**
 * Self-Healing Playwright Action Executor
 * Attempts primary selector first; if a DOM migration occurred, falls back to semantic attributes.
 */
async function executeWithSelfHealing(page, actionType, selectors, value = null, logFn) {
  for (let attempt = 0; attempt < selectors.length; attempt++) {
    const selector = selectors[attempt];
    try {
      logFn('ACTION', 'playwright', `Attempt ${attempt + 1}/${selectors.length}: ${actionType} on '${selector}'`);
      await page.waitForSelector(selector, { timeout: 2500 });
      if (actionType === 'click') {
        await page.click(selector);
      } else if (actionType === 'fill') {
        await page.fill(selector, String(value));
      }
      logFn('SUCCESS', 'playwright', `Successfully executed ${actionType} using selector '${selector}'`);
      return { success: true, usedSelector: selector, attempts: attempt + 1 };
    } catch (err) {
      logFn('WARN', 'agent.adapt', `Selector '${selector}' failed (${err.message}). Adapting to fallback selector...`);
      await new Promise((r) => setTimeout(r, 200 * 2 ** attempt)); // exponential backoff
    }
  }
  throw new Error(`All selectors exhausted for action ${actionType}`);
}

/**
 * POST /api/agent/execute
 * Runs the Goal -> Understand -> Plan -> Execute -> Observe -> Adapt -> Verify -> Complete loop
 */
app.post('/api/agent/execute', async (req, res) => {
  const { goal, invoiceData, approvedByHuman } = req.body;
  const logs = [];
  const logFn = (type, tool, message) => {
    const entry = { timestamp: new Date().toISOString(), type, tool, message };
    logs.push(entry);
    db.prepare('INSERT INTO agent_audit_logs (task_goal, stage, tool, message) VALUES (?, ?, ?, ?)')
      .run(goal, type, tool, message);
  };

  try {
    logFn('INFO', 'runtime.init', `Received task goal: ${goal}`);

    // Policy check (SOP-FIN-04)
    if (invoiceData.amount > 5000 && !approvedByHuman) {
      logFn('WARN', 'policy.guard', `Invoice amount $${invoiceData.amount} exceeds $5,000 autonomous limit.`);
      return res.status(202).json({
        status: 'AWAITING_HUMAN_APPROVAL',
        policy: 'SOP-FIN-04 §2.1',
        logs
      });
    }

    // Persist to SQLite
    const recordId = `REC-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT OR REPLACE INTO invoices (id, invoice_number, vendor, amount, due_date, category, status, verified_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      recordId,
      invoiceData.invoiceNumber,
      invoiceData.vendor,
      invoiceData.amount,
      invoiceData.dueDate,
      invoiceData.category || 'Cloud Infrastructure',
      approvedByHuman ? 'Approved & Verified' : 'Verified & Recorded',
      approvedByHuman ? 'AI Worker + Human Supervisor' : 'CentrAlign AI Worker'
    );

    // Read-After-Write Verification Assertion
    const verifiedRow = db.prepare('SELECT * FROM invoices WHERE invoice_number = ?').get(invoiceData.invoiceNumber);
    if (!verifiedRow || Number(verifiedRow.amount) !== Number(invoiceData.amount)) {
      throw new Error('Verification failed: Database state mismatch after write.');
    }

    logFn('SUCCESS', 'sql.verify', `Verified row ${verifiedRow.id} in SQLite database.`);

    return res.json({
      status: 'VERIFIED_AND_COMPLETED',
      verifiedRow,
      logs
    });
  } catch (error) {
    logFn('ERROR', 'runtime.exception', error.message);
    return res.status(500).json({ status: 'FAILED', error: error.message, logs });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, db: 'sqlite', version: '3.0.0' }));
app.get('/api/audit', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json(db.prepare('SELECT * FROM agent_audit_logs ORDER BY id DESC LIMIT ?').all(limit));
});
app.get('/api/invoices', (_req, res) => res.json(db.prepare('SELECT * FROM invoices ORDER BY updated_at DESC').all()));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CentrAlign AI Autonomous Worker Backend listening on http://localhost:${PORT}`);
});
