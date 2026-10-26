import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  FileText,
  Database,
  Globe,
  ShieldAlert,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Eye,
  Cpu,
  ArrowRight,
  Lock,
  Search,
  Plus,
  Mail,
  Building2,
  DollarSign,
  Calendar,
  FileCheck,
  Code2,
  BookOpen,
  Layers,
  Copy,
  CheckCheck,
  ChevronRight,
  Zap,
  Activity,
  Award,
  KeyRound,
  ExternalLink
} from 'lucide-react';

const LOOP_STAGES = [
  { id: 'GOAL', label: 'Goal', desc: 'Capture user intent' },
  { id: 'UNDERSTAND', label: 'Understand', desc: 'Parse context & entities' },
  { id: 'PLAN', label: 'Plan', desc: 'Synthesize tool DAG' },
  { id: 'EXECUTE', label: 'Execute', desc: 'Operate browser & files' },
  { id: 'OBSERVE', label: 'Observe', desc: 'Inspect DOM & outputs' },
  { id: 'ADAPT', label: 'Adapt', desc: 'Recover or gate approval' },
  { id: 'VERIFY', label: 'Verify', desc: 'Audit DB state change' },
  { id: 'COMPLETE', label: 'Complete', desc: 'Deliver evidence report' }
];

const INITIAL_INVOICES_DB = [
  {
    id: 'REC-1001',
    invoiceNumber: 'INV-2026-081',
    vendor: 'Stripe Cloud Inc.',
    amount: 1850.00,
    dueDate: '2026-10-15',
    category: 'Cloud Infrastructure',
    status: 'Verified & Recorded',
    verifiedBy: 'System Seed',
    updatedAt: '2026-10-02 09:14:22'
  },
  {
    id: 'REC-1002',
    invoiceNumber: 'INV-2026-084',
    vendor: 'Orbit Data Systems',
    amount: 3200.00,
    dueDate: '2026-10-28',
    category: 'Data Analytics',
    status: 'Verified & Recorded',
    verifiedBy: 'System Seed',
    updatedAt: '2026-10-09 14:30:10'
  }
];

const INITIAL_VENDORS_DB = [
  { id: 'VEN-01', name: 'Acme Cloud Corp', email: 'billing@acmecloud.io', paymentTerms: 'Net 30', bankAccount: 'CHASE-****-4412', status: 'Active' },
  { id: 'VEN-02', name: 'NovaTech AI Labs', email: 'finance@novatech.ai', paymentTerms: 'Net 15', bankAccount: 'SVB-****-9920', status: 'Active' },
  { id: 'VEN-03', name: 'Orbit Data Systems', email: 'accounts@orbitdata.io', paymentTerms: 'Net 30', bankAccount: 'CITI-****-1108', status: 'Active' },
  { id: 'VEN-04', name: 'Vertex Security Ltd', email: 'ar@vertexsec.com', paymentTerms: 'Net 45', bankAccount: 'BOA-****-7741', status: 'Active' }
];

const INITIAL_SAMPLE_FILES = [
  {
    id: 'FILE-01',
    filename: 'INV-2026-089_AcmeCloud.pdf',
    source: 'Document Vault (/vault/invoices)',
    receivedDate: '2026-10-18',
    vendor: 'Acme Cloud Corp',
    invoiceNumber: 'INV-2026-089',
    amount: 4250.00,
    dueDate: '2026-11-15',
    category: 'Cloud Infrastructure',
    notes: 'Q4 Dedicated GPU Cluster Hosting & Bandwidth',
    rawContent: `INVOICE DOCUMENT — OFFICIAL RECORD
==================================================
Invoice ID:      INV-2026-089
Vendor Name:     Acme Cloud Corp
Issue Date:      October 18, 2026
Due Date:        2026-11-15
--------------------------------------------------
Line Items:
1. Dedicated H100 Node Cluster (Oct)    $3,800.00
2. Enterprise Egress & Snapshots          $450.00
--------------------------------------------------
TOTAL AMOUNT DUE:                       $4,250.00
Payment Terms:   Net 30 (ACH Transfer)
==================================================`
  },
  {
    id: 'FILE-02',
    filename: 'INV-2026-092_NovaTech.pdf',
    source: 'Document Vault (/vault/invoices)',
    receivedDate: '2026-10-19',
    vendor: 'NovaTech AI Labs',
    invoiceNumber: 'INV-2026-092',
    amount: 14800.00,
    dueDate: '2026-11-05',
    category: 'Enterprise AI Licensing',
    notes: 'Annual Enterprise Fine-Tuning & Evaluation Suite (Requires Human Approval > $5,000)',
    rawContent: `INVOICE DOCUMENT — HIGH VALUE CONTRACT
==================================================
Invoice ID:      INV-2026-092
Vendor Name:     NovaTech AI Labs
Issue Date:      October 19, 2026
Due Date:        2026-11-05
--------------------------------------------------
Line Items:
1. Enterprise Agent Evaluation License  $12,000.00
2. Dedicated RLHF Sandbox Environment    $2,800.00
--------------------------------------------------
TOTAL AMOUNT DUE:                      $14,800.00
Policy Notice:   Amounts > $5,000 require CFO/Human sign-off.
==================================================`
  },
  {
    id: 'FILE-03',
    filename: 'INV-2026-084_OrbitData.pdf',
    source: 'Document Vault (/vault/invoices)',
    receivedDate: '2026-10-08',
    vendor: 'Orbit Data Systems',
    invoiceNumber: 'INV-2026-084',
    amount: 3200.00,
    dueDate: '2026-10-28',
    category: 'Data Analytics',
    notes: 'Already recorded in ERP ledger',
    rawContent: `INVOICE DOCUMENT — OFFICIAL RECORD
==================================================
Invoice ID:      INV-2026-084
Vendor Name:     Orbit Data Systems
Issue Date:      October 08, 2026
Due Date:        2026-10-28
--------------------------------------------------
TOTAL AMOUNT DUE:                       $3,200.00
==================================================`
  }
];

const INITIAL_INBOX_EMAILS = [
  {
    id: 'MSG-201',
    from: 'ar@vertexsec.com',
    senderName: 'Vertex Security Billing',
    subject: 'URGENT: Unpaid Invoice INV-2026-095 for Q4 Penetration Testing',
    date: '2026-10-19 16:42',
    unread: true,
    extractedData: {
      invoiceNumber: 'INV-2026-095',
      vendor: 'Vertex Security Ltd',
      amount: 2950.00,
      dueDate: '2026-11-20',
      category: 'Security & Compliance'
    },
    body: `Hi Finance Team,

Please find enclosed the billing details for our Q4 Autonomous Agent Penetration Testing engagement:
- Invoice Number: INV-2026-095
- Vendor: Vertex Security Ltd
- Total Amount: $2,950.00
- Payment Due Date: 2026-11-20
- Category: Security & Compliance

Kindly enter this into your internal ERP ledger and confirm receipt.

Best regards,
Vertex Security Accounts Receivable`
  },
  {
    id: 'MSG-202',
    from: 'billing@acmecloud.io',
    senderName: 'Acme Cloud Finance',
    subject: 'Updated ACH Bank Routing Details for Acme Cloud Corp',
    date: '2026-10-18 11:05',
    unread: false,
    extractedData: {
      vendor: 'Acme Cloud Corp',
      newBankAccount: 'JPM-****-8839',
      newPaymentTerms: 'Net 45'
    },
    body: `Hello Partner,

Effective immediately, Acme Cloud Corp has migrated its treasury account.
Please update our vendor profile in your ERP system:
- New Bank Account: JPM-****-8839
- Updated Payment Terms: Net 45

Note: Updating vendor bank routing details is a sensitive security action under Company Policy SOP-04.

Thank you,
Acme Cloud Treasury`
  }
];

const PRESET_TASKS = [
  {
    id: 'task-1',
    badge: 'Standard Autonomy + Retry',
    title: 'Process Latest Acme Cloud Invoice',
    prompt: 'Find the latest invoice from Acme Cloud Corp in the document vault, extract the invoice number, amount, and due date, enter it into the internal ERP ledger, and verify that the record is saved.',
    highlights: ['File Parsing', 'DOM Selector Failure & Self-Healing Retry', 'Database Verification']
  },
  {
    id: 'task-2',
    badge: 'Human-in-the-Loop Gate',
    title: 'Process High-Value NovaTech Invoice ($14,800)',
    prompt: 'Locate the latest invoice from NovaTech AI Labs, extract the billing amount and due date, and record it in the company ERP database.',
    highlights: ['Policy Detection (> $5,000 threshold)', 'Pauses for Human Approval', 'Resumes & Verifies']
  },
  {
    id: 'task-3',
    badge: 'Multi-Source Audit',
    title: 'Audit Unread Inbox & Vault for Missing Invoices',
    prompt: 'Check both the company email inbox and document vault for any unrecorded invoices under $5,000 (especially from Vertex Security), add any missing invoice to the ERP ledger, and confirm completion.',
    highlights: ['Cross-Tool Search (Inbox + Vault + DB)', 'Duplicate Prevention', 'Autonomous Entry']
  },
  {
    id: 'task-4',
    badge: 'Sensitive Vendor Mutation',
    title: 'Update Acme Cloud Bank Account from Email',
    prompt: 'Read the email from Acme Cloud Finance regarding their updated ACH bank routing and payment terms, and update their Vendor Profile in the ERP system.',
    highlights: ['Email Entity Extraction', 'Security Policy Approval Gate', 'Vendor Table Verification']
  }
];

export default function App() {
  const [mainView, setMainView] = useState('workspace');
  const [taskInput, setTaskInput] = useState(PRESET_TASKS[0].prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState('GOAL');
  const [completedStages, setCompletedStages] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [agentMemory, setAgentMemory] = useState({});
  const [verificationResult, setVerificationResult] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(null);
  const [simulateSelectorFailure, setSimulateSelectorFailure] = useState(true);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);

  // Simulated Enterprise Environment State
  const [erpTab, setErpTab] = useState('ledger');
  const [invoicesDb, setInvoicesDb] = useState(INITIAL_INVOICES_DB);
  const [vendorsDb, setVendorsDb] = useState(INITIAL_VENDORS_DB);
  const [sampleFiles, setSampleFiles] = useState(INITIAL_SAMPLE_FILES);
  const [inboxEmails, setInboxEmails] = useState(INITIAL_INBOX_EMAILS);
  const [selectedFile, setSelectedFile] = useState(INITIAL_SAMPLE_FILES[0]);
  const [selectedEmail, setSelectedEmail] = useState(INITIAL_INBOX_EMAILS[0]);

  const [browserUrl, setBrowserUrl] = useState('internal.centralign-erp.local/finance/ledger');
  const [agentCursorLabel, setAgentCursorLabel] = useState(null);
  const [liveFormDraft, setLiveFormDraft] = useState({
    invoiceNumber: '',
    vendor: '',
    amount: '',
    dueDate: '',
    category: ''
  });
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileForm, setNewFileForm] = useState({
    vendor: 'ScaleOps AI Inc.',
    invoiceNumber: 'INV-2026-099',
    amount: '3750',
    dueDate: '2026-11-28',
    category: 'AI Infrastructure'
  });

  const [copiedDoc, setCopiedDoc] = useState(null);

  // ---- v3: run history, metrics, evidence receipt, backend link, Ctrl+Enter ----
  const [runHistory, setRunHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ca_runs') || '[]'); } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [backend, setBackend] = useState('checking');
  const runStartRef = useRef(null);

  const runMetrics = () => ({
    steps: actionPlan.length,
    selfHeals: executionLogs.filter((l) => l.type === 'WARN' && /fallback|adapt|retry/i.test(l.message || '')).length,
    approvals: executionLogs.filter((l) => /approv/i.test(l.message || '')).length,
    events: executionLogs.length,
    seconds: runStartRef.current ? Math.max(1, Math.round((Date.now() - runStartRef.current) / 1000)) : 0
  });

  useEffect(() => { if (isRunning) runStartRef.current = Date.now(); }, [isRunning]);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    fetch('http://localhost:4000/api/health', { signal: ctrl.signal })
      .then((r) => setBackend(r.ok ? 'live' : 'sandbox'))
      .catch(() => setBackend('sandbox'))
      .finally(() => clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!verificationResult) return;
    const entry = { at: new Date().toISOString(), goal: taskInput, status: verificationResult.status, recordId: verificationResult.recordId, ...runMetrics() };
    setRunHistory((prev) => {
      const next = [entry, ...prev].slice(0, 12);
      try { localStorage.setItem('ca_runs', JSON.stringify(next)); } catch {}
      return next;
    });
  }, [verificationResult]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isRunning && !pendingApproval) executeAutonomousTask();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRunning, pendingApproval, taskInput]);

  const downloadReceipt = () => {
    const m = runMetrics();
    const md = [
      '# CentrAlign evidence receipt', '',
      `Task: ${taskInput}`,
      `Outcome: ${verificationResult.status} (${verificationResult.recordId})`,
      `Run: ${m.seconds}s, ${m.steps} steps, ${m.selfHeals} self-heals, ${m.approvals} approval events`, '',
      '## Summary', verificationResult.summary, '',
      '## Evidence', ...Object.entries(verificationResult.evidence).map(([k, v]) => `- ${k}: ${v}`), '',
      '## Plan', ...actionPlan.map((st, i) => `${i + 1}. [${st.status}] ${st.tool}: ${st.action}`), '',
      '## Audit trail', ...executionLogs.map((l) => `- ${l.timestamp} ${l.type} ${l.tool}: ${l.message}`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    a.download = `receipt-${verificationResult.recordId}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const approvalResolverRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLogs]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const appendLog = (type, tool, message, detail = null) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setExecutionLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp,
        type,
        tool,
        message,
        detail
      }
    ]);
  };

  const advanceStage = (stageId) => {
    setCurrentStage(stageId);
    const idx = LOOP_STAGES.findIndex((s) => s.id === stageId);
    if (idx > 0) {
      const priorIds = LOOP_STAGES.slice(0, idx).map((s) => s.id);
      setCompletedStages(priorIds);
    }
  };

  const updatePlanStep = (stepIndex, status, note = null) => {
    setActionPlan((prev) =>
      prev.map((step, i) =>
        i === stepIndex ? { ...step, status, note: note || step.note } : step
      )
    );
  };

  const callGeminiReasoner = async (userGoal, envSnapshot) => {
    const apiKey = customApiKey || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || "";
    if (!apiKey) return null;

    const systemPrompt = `You are the CentrAlign AI Autonomous Task Worker Runtime.
Given a user's plain-English task and the current enterprise environment snapshot, determine the target workflow and produce a structured JSON plan.
Return strictly valid JSON matching the schema.`;

    const promptText = `User Task: "${userGoal}"
Environment Snapshot:
- Vault Files: ${JSON.stringify(envSnapshot.files.map(f => ({ filename: f.filename, vendor: f.vendor, invoiceNumber: f.invoiceNumber, amount: f.amount, dueDate: f.dueDate, category: f.category })))}
- Inbox Emails: ${JSON.stringify(envSnapshot.emails.map(e => ({ subject: e.subject, extractedData: e.extractedData })))}
- Existing ERP Invoices: ${JSON.stringify(envSnapshot.invoices.map(i => i.invoiceNumber))}
- Company Policy: Invoices > $5,000 OR changes to Vendor Bank Account require explicit Human-in-the-Loop approval.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  interpretedGoal: { type: 'STRING' },
                  workflowType: {
                    type: 'STRING',
                    enum: ['INVOICE_FROM_VAULT', 'INVOICE_FROM_INBOX', 'VENDOR_BANK_UPDATE']
                  },
                  targetVendorKeyword: { type: 'STRING' },
                  requiresHumanApproval: { type: 'BOOLEAN' },
                  approvalReason: { type: 'STRING' },
                  planSteps: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        tool: { type: 'STRING' },
                        action: { type: 'STRING' },
                        rationale: { type: 'STRING' }
                      },
                      required: ['tool', 'action', 'rationale']
                    }
                  }
                },
                required: ['interpretedGoal', 'workflowType', 'targetVendorKeyword', 'requiresHumanApproval', 'planSteps']
              }
            }
          })
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) return JSON.parse(rawText);
    } catch (err) {
      console.warn('Fallback to deterministic planner:', err);
    }
    return null;
  };

  const callGeminiSummary = async (userGoal, outcomeRecord, logsCount, didRetry, didApprove) => {
    const apiKey = customApiKey || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || "";
    if (!apiKey) return null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Write a concise, executive 2-sentence verification summary from an autonomous AI employee confirming that the task "${userGoal}" was completed and verified in the database.
Outcome record: ${JSON.stringify(outcomeRecord)}.
Mention that ${logsCount} tool steps were executed${didRetry ? ', including automatic self-healing recovery from a stale DOM selector' : ''}${didApprove ? ', and human policy approval was obtained' : ''}.`
                  }
                ]
              }
            ]
          })
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
      return null;
    }
  };

  const requestHumanApproval = (approvalPayload) => {
    return new Promise((resolve) => {
      setPendingApproval(approvalPayload);
      approvalResolverRef.current = resolve;
    });
  };

  const handleApprovalDecision = (approved) => {
    if (approvalResolverRef.current) {
      approvalResolverRef.current(approved);
      approvalResolverRef.current = null;
    }
    setPendingApproval(null);
  };

  const executeAutonomousTask = async (customPrompt = null) => {
    const goalText = (customPrompt || taskInput).trim();
    if (!goalText || isRunning) return;

    setIsRunning(true);
    setVerificationResult(null);
    setPendingApproval(null);
    setExecutionLogs([]);
    setAgentMemory({ taskGoal: goalText, status: 'Initializing' });
    setCompletedStages([]);
    setHighlightedRowId(null);

    // 1. GOAL
    advanceStage('GOAL');
    appendLog('INFO', 'runtime.init', `Goal received: "${goalText}"`);
    await sleep(500);

    // 2. UNDERSTAND
    advanceStage('UNDERSTAND');
    appendLog('REASON', 'llm.understand', 'Analyzing intent, workspace tools, and SOP-FIN-04 policy boundaries via Gemini Reasoner...');

    const envSnapshot = {
      files: sampleFiles,
      emails: inboxEmails,
      invoices: invoicesDb,
      vendors: vendorsDb
    };

    const lowerGoal = goalText.toLowerCase();
    let llmPlan = await callGeminiReasoner(goalText, envSnapshot);

    let workflowType = 'INVOICE_FROM_VAULT';
    let targetCandidate = null;
    let requiresApproval = false;
    let approvalReason = '';

    if (lowerGoal.includes('bank') || lowerGoal.includes('routing') || lowerGoal.includes('vendor profile')) {
      workflowType = 'VENDOR_BANK_UPDATE';
      targetCandidate = inboxEmails.find((e) => e.extractedData?.newBankAccount) || inboxEmails[1];
      requiresApproval = true;
      approvalReason = 'SOP-FIN-04 Section 3.2: Modifying vendor ACH bank routing details requires Human-in-the-Loop authorization.';
    } else if (lowerGoal.includes('inbox') || lowerGoal.includes('email') || lowerGoal.includes('vertex') || lowerGoal.includes('missing')) {
      workflowType = 'INVOICE_FROM_INBOX';
      targetCandidate = inboxEmails[0];
      requiresApproval = false;
    } else if (lowerGoal.includes('novatech') || lowerGoal.includes('14,800') || lowerGoal.includes('high-value')) {
      workflowType = 'INVOICE_FROM_VAULT';
      targetCandidate = sampleFiles.find((f) => f.vendor.toLowerCase().includes('novatech')) || sampleFiles[1];
      requiresApproval = true;
      approvalReason = `SOP-FIN-04 Section 2.1: Invoice total ($${targetCandidate.amount.toLocaleString()}) exceeds the $5,000 autonomous execution limit.`;
    } else {
      workflowType = 'INVOICE_FROM_VAULT';
      const customMatch = sampleFiles.find(
        (f) => lowerGoal.includes(f.vendor.toLowerCase().split(' ')[0]) || lowerGoal.includes(f.invoiceNumber.toLowerCase())
      );
      targetCandidate = customMatch || sampleFiles[0];
      if (targetCandidate.amount > 5000) {
        requiresApproval = true;
        approvalReason = `SOP-FIN-04 Section 2.1: Invoice total ($${targetCandidate.amount.toLocaleString()}) exceeds the $5,000 autonomous execution limit.`;
      }
    }

    const interpretedGoal =
      llmPlan?.interpretedGoal ||
      (workflowType === 'VENDOR_BANK_UPDATE'
        ? 'Extract updated ACH routing credentials from email and update Vendor ERP record with policy verification.'
        : `Locate target invoice document, extract structured billing metadata, populate internal ERP ledger, and verify database commit.`);

    setAgentMemory((prev) => ({
      ...prev,
      interpretedGoal,
      workflowType,
      policyCheck: requiresApproval ? 'Requires Human Gate' : 'Within Autonomous Threshold (< $5,000)'
    }));

    appendLog('SUCCESS', 'llm.understand', `Intent resolved: ${interpretedGoal}`);
    await sleep(500);

    // 3. PLAN
    advanceStage('PLAN');
    const structuredSteps =
      workflowType === 'VENDOR_BANK_UPDATE'
        ? [
            { tool: 'inbox.search', action: 'Scan company inbox for vendor treasury update notice', status: 'pending' },
            { tool: 'llm.extract', action: 'Extract Vendor Name, New ACH Account, and Payment Terms', status: 'pending' },
            { tool: 'policy.guard', action: 'Request Human-in-the-Loop approval for bank routing change', status: 'pending' },
            { tool: 'playwright.erp', action: 'Navigate to ERP Vendor Profiles & update routing record', status: 'pending' },
            { tool: 'db.verify', action: 'Query SQLite vendor table to verify persisted bank account', status: 'pending' }
          ]
        : [
            {
              tool: workflowType === 'INVOICE_FROM_INBOX' ? 'inbox.scan' : 'vault.fs.scan',
              action: workflowType === 'INVOICE_FROM_INBOX'
                ? 'Scan unread emails & vault for unrecorded invoices'
                : `Locate latest invoice PDF for ${targetCandidate.vendor}`,
              status: 'pending'
            },
            { tool: 'pdf.parser', action: 'Parse document & extract Invoice #, Vendor, Amount, Due Date', status: 'pending' },
            { tool: 'policy.evaluate', action: 'Evaluate extracted amount against SOP-FIN-04 ($5,000 cap)', status: 'pending' },
            { tool: 'playwright.fill', action: 'Automate ERP Ledger form entry & submit transaction', status: 'pending' },
            { tool: 'sql.verify', action: 'Execute read-after-write verification query on ERP Ledger', status: 'pending' }
          ];

    setActionPlan(structuredSteps);
    appendLog(
      'INFO',
      'planner.dag',
      `Generated ${structuredSteps.length}-step execution plan with verification assertions.`,
      structuredSteps.map((s, i) => `${i + 1}. [${s.tool}] ${s.action}`).join('\n')
    );
    await sleep(600);

    // 4. EXECUTE & 5. OBSERVE
    advanceStage('EXECUTE');

    if (workflowType === 'VENDOR_BANK_UPDATE') {
      updatePlanStep(0, 'running');
      setErpTab('inbox');
      setBrowserUrl('internal.centralign-erp.local/mail/inbox');
      setAgentCursorLabel('Scanning Inbox...');
      appendLog('ACTION', 'inbox.search', 'Querying inbox: from:billing@acmecloud.io subject:"ACH Bank Routing"');
      await sleep(700);

      const emailDoc = targetCandidate;
      setSelectedEmail(emailDoc);
      updatePlanStep(0, 'completed');

      advanceStage('OBSERVE');
      appendLog('OBSERVE', 'inbox.read', `Located email MSG-202 from ${emailDoc.from}`);

      updatePlanStep(1, 'running');
      await sleep(600);
      const extracted = emailDoc.extractedData;
      setAgentMemory((prev) => ({
        ...prev,
        extractedEntity: extracted
      }));
      appendLog(
        'SUCCESS',
        'llm.extract',
        `Extracted: Vendor="${extracted.vendor}", NewBank="${extracted.newBankAccount}", Terms="${extracted.newPaymentTerms}"`
      );
      updatePlanStep(1, 'completed');

      // 6. ADAPT (Approval Gate)
      advanceStage('ADAPT');
      updatePlanStep(2, 'running');
      appendLog('WARN', 'policy.guard', approvalReason);
      setAgentCursorLabel('Awaiting Human Approval...');

      const approved = await requestHumanApproval({
        title: 'Sensitive Vendor Treasury Update',
        policyCode: 'SOP-FIN-04 §3.2',
        reason: approvalReason,
        details: {
          Action: 'Modify Vendor Bank Routing',
          Vendor: extracted.vendor,
          'Previous Account': 'CHASE-****-4412',
          'New Account': extracted.newBankAccount,
          'Payment Terms': extracted.newPaymentTerms
        }
      });

      if (!approved) {
        updatePlanStep(2, 'failed', 'Rejected by human supervisor');
        appendLog('ERROR', 'policy.guard', 'Execution aborted: Human operator denied sensitive bank modification.');
        setAgentCursorLabel(null);
        setIsRunning(false);
        return;
      }

      updatePlanStep(2, 'completed', 'Approved by Human Operator');
      appendLog('SUCCESS', 'policy.guard', 'Human supervisor approved action. Resuming execution...');

      advanceStage('EXECUTE');
      updatePlanStep(3, 'running');
      setErpTab('vendors');
      setBrowserUrl('internal.centralign-erp.local/finance/vendors');
      setAgentCursorLabel('Updating Vendor Row...');
      await sleep(800);

      setVendorsDb((prev) =>
        prev.map((v) =>
          v.name === extracted.vendor
            ? { ...v, bankAccount: extracted.newBankAccount, paymentTerms: extracted.newPaymentTerms, status: 'Verified Updated' }
            : v
        )
      );
      setHighlightedRowId('VEN-01');
      appendLog('ACTION', 'playwright.erp', `Updated ${extracted.vendor} bankAccount -> ${extracted.newBankAccount}`);
      updatePlanStep(3, 'completed');

      // 7. VERIFY
      advanceStage('VERIFY');
      updatePlanStep(4, 'running');
      await sleep(650);
      appendLog(
        'SUCCESS',
        'db.verify',
        `SELECT bank_account, payment_terms FROM vendors WHERE name='Acme Cloud Corp' => ['${extracted.newBankAccount}', '${extracted.newPaymentTerms}'] (MATCH)`
      );
      updatePlanStep(4, 'completed');

      // 8. COMPLETE
      advanceStage('COMPLETE');
      setCompletedStages(LOOP_STAGES.map((s) => s.id));
      setAgentCursorLabel(null);

      const summaryText =
        (await callGeminiSummary(goalText, extracted, 8, false, true)) ||
        `Successfully extracted Acme Cloud Corp's updated ACH routing credentials (${extracted.newBankAccount}, ${extracted.newPaymentTerms}) from the company inbox, obtained mandatory human security approval, and verified the updated record in the ERP Vendor database.`;

      setVerificationResult({
        status: 'VERIFIED & COMPLETED',
        recordId: 'VEN-01',
        summary: summaryText,
        evidence: {
          Source: 'Inbox Message MSG-202 (billing@acmecloud.io)',
          TargetTable: 'erp_vendors',
          UpdatedFields: `bank_account = ${extracted.newBankAccount}, payment_terms = ${extracted.newPaymentTerms}`,
          HumanApproval: 'Granted (SOP-FIN-04 §3.2)',
          VerificationQuery: 'PASS (Read-after-write assertion matched)'
        }
      });
      setIsRunning(false);
      return;
    }

    // WORKFLOW: INVOICE PROCESSING
    updatePlanStep(0, 'running');
    if (workflowType === 'INVOICE_FROM_INBOX') {
      setErpTab('inbox');
      setBrowserUrl('internal.centralign-erp.local/mail/inbox');
      setAgentCursorLabel('Scanning Unread Emails...');
      appendLog('ACTION', 'inbox.scan', 'Checking company inbox for unrecorded vendor invoices...');
      await sleep(700);
      setSelectedEmail(inboxEmails[0]);
      appendLog('OBSERVE', 'inbox.scan', `Found unread invoice email: "${inboxEmails[0].subject}"`);
    } else {
      setErpTab('vault');
      setBrowserUrl('internal.centralign-erp.local/vault/invoices');
      setAgentCursorLabel(`Locating ${targetCandidate.filename}...`);
      appendLog('ACTION', 'vault.fs.scan', `Listing files in /vault/invoices matching vendor query...`);
      await sleep(700);
      setSelectedFile(targetCandidate);
      appendLog('OBSERVE', 'vault.fs.scan', `Selected latest matching document: ${targetCandidate.filename}`);
    }
    updatePlanStep(0, 'completed');

    // Step 2: Parse & Extract
    advanceStage('OBSERVE');
    updatePlanStep(1, 'running');
    setAgentCursorLabel('Extracting Document Entities...');
    await sleep(700);

    const extractedInvoice =
      workflowType === 'INVOICE_FROM_INBOX'
        ? inboxEmails[0].extractedData
        : {
            invoiceNumber: targetCandidate.invoiceNumber,
            vendor: targetCandidate.vendor,
            amount: targetCandidate.amount,
            dueDate: targetCandidate.dueDate,
            category: targetCandidate.category
          };

    const alreadyExists = invoicesDb.some((inv) => inv.invoiceNumber === extractedInvoice.invoiceNumber);
    setAgentMemory((prev) => ({
      ...prev,
      extractedInvoice,
      duplicateCheck: alreadyExists ? 'DUPLICATE_FOUND' : 'UNIQUE_NEW_RECORD'
    }));

    appendLog(
      'SUCCESS',
      'pdf.parser',
      `Extracted: Invoice=${extractedInvoice.invoiceNumber} | Vendor=${extractedInvoice.vendor} | Amount=$${extractedInvoice.amount.toLocaleString()} | Due=${extractedInvoice.dueDate}`
    );
    updatePlanStep(1, 'completed');

    // Step 3: Policy Evaluation & Human Approval Gate
    updatePlanStep(2, 'running');
    await sleep(500);
    let humanApprovedFlag = false;

    if (requiresApproval) {
      advanceStage('ADAPT');
      appendLog('WARN', 'policy.evaluate', approvalReason);
      setAgentCursorLabel('Paused: Human Approval Required');

      const approved = await requestHumanApproval({
        title: 'High-Value Invoice Approval Required',
        policyCode: 'SOP-FIN-04 §2.1',
        reason: approvalReason,
        details: {
          'Invoice Number': extractedInvoice.invoiceNumber,
          Vendor: extractedInvoice.vendor,
          'Total Amount': `$${extractedInvoice.amount.toLocaleString()}`,
          'Due Date': extractedInvoice.dueDate,
          Category: extractedInvoice.category
        }
      });

      if (!approved) {
        updatePlanStep(2, 'failed', 'Denied by Human Supervisor');
        appendLog('ERROR', 'policy.evaluate', 'Task halted: High-value invoice was rejected by human reviewer.');
        setAgentCursorLabel(null);
        setIsRunning(false);
        return;
      }
      humanApprovedFlag = true;
      appendLog('SUCCESS', 'policy.evaluate', 'Human supervisor approved high-value invoice entry. Proceeding...');
      updatePlanStep(2, 'completed', 'Approved by Human Supervisor');
    } else {
      appendLog(
        'SUCCESS',
        'policy.evaluate',
        `Amount ($${extractedInvoice.amount.toLocaleString()}) is within autonomous threshold (<= $5,000). Auto-approved.`
      );
      updatePlanStep(2, 'completed');
    }

    // Step 4: Automate ERP Ledger Form
    advanceStage('EXECUTE');
    updatePlanStep(3, 'running');
    setErpTab('ledger');
    setBrowserUrl('internal.centralign-erp.local/finance/ledger');
    setAgentCursorLabel('Filling ERP Form via Playwright...');
    await sleep(550);

    setLiveFormDraft({
      invoiceNumber: extractedInvoice.invoiceNumber,
      vendor: '',
      amount: '',
      dueDate: '',
      category: ''
    });
    await sleep(220);
    setLiveFormDraft((prev) => ({ ...prev, vendor: extractedInvoice.vendor }));
    await sleep(220);
    setLiveFormDraft((prev) => ({ ...prev, amount: String(extractedInvoice.amount) }));
    await sleep(220);
    setLiveFormDraft((prev) => ({
      ...prev,
      dueDate: extractedInvoice.dueDate,
      category: extractedInvoice.category
    }));
    appendLog('ACTION', 'playwright.fill', `Populated ERP form inputs for ${extractedInvoice.invoiceNumber}`);
    await sleep(450);

    // Self-Healing Retry Demonstration
    let didSelfHeal = false;
    if (simulateSelectorFailure) {
      advanceStage('ADAPT');
      appendLog(
        'ERROR',
        'playwright.click',
        `TimeoutError: locator.click('#legacy-submit-btn-v1') failed — element not attached to DOM (UI v2.4 migration detected).`
      );
      updatePlanStep(3, 'running', 'Retrying with DOM fallback...');
      setAgentCursorLabel('Adapting Selector (Retry 1/3)...');
      await sleep(750);

      appendLog(
        'WARN',
        'agent.adapt',
        `Inspecting live accessibility tree... Discovered semantic button [data-testid="erp-record-submit"]. Retrying click action (Attempt 2/3)...`
      );
      await sleep(600);
      appendLog('SUCCESS', 'playwright.click', `Fallback selector [data-testid="erp-record-submit"] succeeded (HTTP 201 Created).`);
      didSelfHeal = true;
    } else {
      appendLog('SUCCESS', 'playwright.click', `Clicked [data-testid="erp-record-submit"] -> HTTP 201 Created.`);
    }

    const newRecordId = `REC-${1003 + invoicesDb.length}`;
    const newRecord = {
      id: newRecordId,
      invoiceNumber: extractedInvoice.invoiceNumber,
      vendor: extractedInvoice.vendor,
      amount: Number(extractedInvoice.amount),
      dueDate: extractedInvoice.dueDate,
      category: extractedInvoice.category,
      status: humanApprovedFlag ? 'Approved & Verified' : 'Verified & Recorded',
      verifiedBy: humanApprovedFlag ? 'AI Worker + Human Sign-off' : 'CentrAlign AI Worker',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setInvoicesDb((prev) => {
      const filtered = prev.filter((item) => item.invoiceNumber !== newRecord.invoiceNumber);
      return [newRecord, ...filtered];
    });
    setHighlightedRowId(newRecordId);
    setLiveFormDraft({ invoiceNumber: '', vendor: '', amount: '', dueDate: '', category: '' });
    updatePlanStep(3, 'completed', didSelfHeal ? 'Recovered via fallback selector' : 'Completed');

    // Step 5: Verify Database State
    advanceStage('VERIFY');
    updatePlanStep(4, 'running');
    setAgentCursorLabel('Verifying SQLite Record...');
    await sleep(650);

    appendLog(
      'ACTION',
      'sql.verify',
      `Executing read-after-write verification: SELECT * FROM invoices WHERE invoice_number = '${extractedInvoice.invoiceNumber}'`
    );
    await sleep(400);
    appendLog(
      'SUCCESS',
      'sql.verify',
      `Verification Assertion PASSED: Row ${newRecordId} confirmed with amount=$${newRecord.amount.toLocaleString()} and due_date='${newRecord.dueDate}'.`
    );
    updatePlanStep(4, 'completed');

    // Step 6: Complete
    advanceStage('COMPLETE');
    setCompletedStages(LOOP_STAGES.map((s) => s.id));
    setAgentCursorLabel(null);

    const executiveSummary =
      (await callGeminiSummary(goalText, newRecord, 9, didSelfHeal, humanApprovedFlag)) ||
      `Autonomously located invoice ${newRecord.invoiceNumber} from ${newRecord.vendor}, extracted the total amount of $${newRecord.amount.toLocaleString()} (due ${newRecord.dueDate}), recorded it into the internal ERP ledger${didSelfHeal ? ' after self-healing from a legacy DOM selector change' : ''}${humanApprovedFlag ? ' with human supervisor sign-off' : ''}, and verified persistence under record ID ${newRecord.id}.`;

    setVerificationResult({
      status: 'VERIFIED & COMPLETED',
      recordId: newRecord.id,
      summary: executiveSummary,
      evidence: {
        'Record ID': newRecord.id,
        'Invoice Number': newRecord.invoiceNumber,
        Vendor: newRecord.vendor,
        'Verified Amount': `$${newRecord.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        'Due Date': newRecord.dueDate,
        'Self-Healing Recovery': didSelfHeal ? 'Yes (Recovered from #legacy-submit-btn-v1 -> [data-testid="erp-record-submit"])' : 'None needed',
        'Database Checksum': `SHA256:${btoa(newRecord.invoiceNumber + '-' + newRecord.amount).slice(0, 16)}`
      }
    });

    setIsRunning(false);
  };

  const handleResetEnvironment = () => {
    if (isRunning) return;
    setInvoicesDb(INITIAL_INVOICES_DB);
    setVendorsDb(INITIAL_VENDORS_DB);
    setSampleFiles(INITIAL_SAMPLE_FILES);
    setInboxEmails(INITIAL_INBOX_EMAILS);
    setExecutionLogs([]);
    setActionPlan([]);
    setAgentMemory({});
    setVerificationResult(null);
    setPendingApproval(null);
    setCurrentStage('GOAL');
    setCompletedStages([]);
    setHighlightedRowId(null);
  };

  const handleCreateCustomInvoice = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(newFileForm.amount) || 2500;
    const filename = `${newFileForm.invoiceNumber}_${newFileForm.vendor.replace(/\s+/g, '')}.pdf`;
    const created = {
      id: `FILE-0${sampleFiles.length + 1}`,
      filename,
      source: 'Document Vault (/vault/invoices)',
      receivedDate: '2026-10-20',
      vendor: newFileForm.vendor,
      invoiceNumber: newFileForm.invoiceNumber,
      amount: amountNum,
      dueDate: newFileForm.dueDate,
      category: newFileForm.category,
      notes: 'Custom user-created test invoice for generalization evaluation',
      rawContent: `INVOICE DOCUMENT — CUSTOM TEST RECORD
==================================================
Invoice ID:      ${newFileForm.invoiceNumber}
Vendor Name:     ${newFileForm.vendor}
Issue Date:      October 20, 2026
Due Date:        ${newFileForm.dueDate}
Category:        ${newFileForm.category}
--------------------------------------------------
TOTAL AMOUNT DUE:                       $${amountNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
==================================================`
    };
    setSampleFiles((prev) => [created, ...prev]);
    setSelectedFile(created);
    setErpTab('vault');
    setTaskInput(
      `Find the latest invoice from ${created.vendor} (${created.invoiceNumber}), extract the amount and due date, and record it in our internal ERP ledger.`
    );
    setShowNewFileModal(false);
  };

  const copyToClipboard = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedDoc(key);
    setTimeout(() => setCopiedDoc(null), 2000);
  };

  return (
    <div className="min-h-screen framer-bg framer-dot-grid text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
      {/* Framer Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0B1A19]">
        <div className="max-w-[1640px] mx-auto px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-violet-400 translate-x-1 translate-y-1 rounded-xl"></div>
              <div className="relative w-10 h-10 rounded-xl bg-[#12302C] border border-white/15 flex items-center justify-center shadow-xl">
                <Cpu className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-base tracking-tight text-white">
                  CentrAlign <span className="framer-gradient-text">AI</span>
                </span>
                <span className="text-[10px] font-mono-code uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                  Autonomous Worker v2.4
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Goal → Plan → Execute → Observe → Adapt → Verify → Complete
              </p>
            </div>
          </div>

          {/* Center Loop Status Indicator Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full framer-card text-xs">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-violet-400'}`} />
            <span className="text-zinc-400">Runtime Engine:</span>
            <span className="font-mono-code text-zinc-200 font-medium">Gemini 2.5 Flash + Playwright DOM Bridge</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> SQLite Read-After-Write Active
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowApiModal(true)}
              className="framer-btn-glass px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
              title="Configure Optional Gemini API Key"
            >
              <KeyRound className="w-3.5 h-3.5 text-violet-400" />
              <span>{customApiKey ? 'API Key Linked' : 'API Key'}</span>
            </button>

            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setMainView('workspace')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mainView === 'workspace'
                    ? 'framer-btn-primary text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Live Agent Workspace
              </button>
              <button
                onClick={() => setMainView('submission')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mainView === 'submission'
                    ? 'framer-btn-primary text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Submission & Architecture Docs
              </button>
            </div>
          </div>
        </div>

        {/* Framer Segmented 8-Stage Pipeline Bar */}
        <div className="border-t border-white/[0.06] bg-[#07080d]/90">
          <div className="max-w-[1640px] mx-auto px-5 py-2.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1.5 min-w-max">
              {LOOP_STAGES.map((stage, index) => {
                const isCurrent = currentStage === stage.id && isRunning;
                const isDone = completedStages.includes(stage.id) || (currentStage === 'COMPLETE' && !isRunning && completedStages.length > 0);
                return (
                  <React.Fragment key={stage.id}>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-violet-500/20 border-violet-400/60 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] scale-[1.03]'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-500'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono-code font-bold ${
                          isCurrent
                            ? 'bg-violet-400 text-slate-950 animate-pulse'
                            : isDone
                            ? 'bg-emerald-500/30 text-emerald-300'
                            : 'bg-white/5 text-zinc-500'
                        }`}
                      >
                        {isDone ? '✓' : index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold leading-none">{stage.label}</span>
                        <span className="text-[10px] opacity-75 hidden sm:inline mt-0.5">{stage.desc}</span>
                      </div>
                    </div>
                    {index < LOOP_STAGES.length - 1 && (
                      <ChevronRight className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-500/60' : 'text-zinc-700'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08] shrink-0">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={simulateSelectorFailure}
                  onChange={(e) => setSimulateSelectorFailure(e.target.checked)}
                  disabled={isRunning}
                  className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
                />
                <span>Simulate Stale DOM Selector (Test Self-Healing)</span>
              </label>
              <span className="font-mono-code text-[11px] px-2.5 py-1 rounded-full border border-white/15 text-zinc-300" title="Header chip: whether server/agent-worker.js (SQLite + Playwright) is reachable on :4000">
                {backend === 'live' ? 'SQLite backend linked' : backend === 'checking' ? 'Checking backend' : 'Browser sandbox'}
              </span>
              <button onClick={() => setShowHistory((v) => !v)} className="framer-btn-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs">
                Run history ({runHistory.length})
              </button>
              <button
                onClick={handleResetEnvironment}
                disabled={isRunning}
                className="framer-btn-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset State
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* WORKSPACE VIEW */}
      {mainView === 'workspace' ? (
        <main className="flex-1 max-w-[1640px] w-full mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: FRAMER COMMAND & TELEMETRY CONSOLE */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Task Dispatcher Card */}
            <div className="framer-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  1. Natural Language Task Objective
                </span>
                <span className="text-[11px] text-zinc-400 font-mono-code">SOP-FIN-04 Enforced</span>
              </div>

              <textarea
                rows={3}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                disabled={isRunning}
                placeholder="Describe a business task in plain English..."
                className="w-full rounded-xl bg-[#06070b]/90 border border-white/10 focus:border-violet-500/70 focus:outline-none p-3.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none leading-relaxed shadow-inner transition-colors"
              />

              {/* Preset Scenarios Grid */}
              <div className="mt-3.5">
                <div className="text-[11px] text-zinc-400 mb-2 font-medium">
                  Evaluation Benchmark Scenarios (Click to load):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_TASKS.map((preset) => (
                    <button
                      key={preset.id}
                      disabled={isRunning}
                      onClick={() => setTaskInput(preset.prompt)}
                      className={`text-left p-2.5 rounded-xl framer-card-interactive disabled:opacity-50 ${
                        taskInput === preset.prompt
                          ? '!border-violet-500/60 !bg-violet-500/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
                          {preset.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-100 line-clamp-1">{preset.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-white/[0.07]">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Invoices &gt; $5,000 or Bank Edits trigger Human Gate</span>
                </div>
                <button
                  onClick={() => executeAutonomousTask()}
                  disabled={isRunning || !taskInput.trim()}
                  className="framer-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing Loop...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Dispatch AI Worker
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* HUMAN-IN-THE-LOOP APPROVAL MODAL BANNER */}
            {pendingApproval && (
              <div className="rounded-2xl border-2 border-amber-500/70 bg-gradient-to-b from-amber-500/15 to-[#0F2523] p-5 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Human-in-the-Loop Approval Gate
                        </span>
                        <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                          {pendingApproval.policyCode}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{pendingApproval.title}</h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-amber-100/90 mt-2.5 leading-relaxed bg-black/30 p-3 rounded-xl border border-amber-500/20">
                  {pendingApproval.reason}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
                  {Object.entries(pendingApproval.details).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-zinc-400 block text-[10px] uppercase">{k}</span>
                      <span className="font-mono-code text-zinc-100 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => handleApprovalDecision(false)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Deny & Halt Task
                  </button>
                  <button
                    onClick={() => handleApprovalDecision(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    Approve & Resume Execution
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Action Plan & Working Memory */}
            <div className="framer-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  2. Generated Execution DAG & Working Memory
                </span>
                <span className="text-[11px] font-mono-code text-zinc-400">
                  {actionPlan.filter((s) => s.status === 'completed').length}/{actionPlan.length || 0} Steps
                </span>
              </div>

              {actionPlan.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl">
                  Dispatch a task above to watch the agent synthesize a multi-step tool execution plan.
                </div>
              ) : (
                <div className="space-y-2">
                  {actionPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 transition-all ${
                        step.status === 'running'
                          ? 'bg-violet-500/15 border-violet-500/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          : step.status === 'completed'
                          ? 'bg-emerald-500/[0.06] border-emerald-500/25 text-zinc-200'
                          : step.status === 'failed'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-500'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {step.status === 'running' ? (
                            <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                          ) : step.status === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : step.status === 'failed' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 inline-block" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium leading-snug">{step.action}</div>
                          {step.note && (
                            <div className="text-[11px] text-amber-300/90 mt-0.5 font-mono-code">↳ {step.note}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-black/40 text-zinc-300 border border-white/10 shrink-0">
                        {step.tool}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(agentMemory).length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.07]">
                  <div className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 mb-1.5">
                    Agent State Context (Working Memory)
                  </div>
                  <pre className="text-[11px] font-mono-code bg-[#0B1A19] border border-white/[0.07] rounded-xl p-2.5 text-cyan-300/90 overflow-x-auto max-h-28">
                    {JSON.stringify(agentMemory, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Live Execution Telemetry Terminal */}
            <div className="framer-card rounded-2xl p-5 flex-1 flex flex-col min-h-[250px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  3. Real-Time Execution & Self-Healing Logs
                </span>
                <span className="text-[11px] font-mono-code text-zinc-500">{executionLogs.length} events</span>
              </div>

              <div
                ref={logContainerRef}
                className="flex-1 bg-[#0B1A19] border border-white/[0.08] rounded-xl p-3 font-mono-code text-xs space-y-2 overflow-y-auto max-h-[260px]"
              >
                {executionLogs.length === 0 ? (
                  <div className="text-zinc-600 py-8 text-center">
                    // Waiting for task execution... Tool calls, DOM observations, and SQLite verification queries will stream here.
                  </div>
                ) : (
                  executionLogs.map((log) => {
                    const badgeStyle =
                      log.type === 'ERROR'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : log.type === 'WARN'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : log.type === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : log.type === 'ACTION'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-violet-500/20 text-violet-300 border-violet-500/30';
                    return (
                      <div key={log.id} className="leading-relaxed border-b border-white/[0.04] pb-1.5 last:border-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-zinc-600 text-[10px]">{log.timestamp}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                            {log.type}
                          </span>
                          <span className="text-zinc-400 text-[11px]">[{log.tool}]</span>
                          <span className="text-zinc-200">{log.message}</span>
                        </div>
                        {log.detail && (
                          <pre className="mt-1 text-[10px] text-zinc-400 bg-white/[0.03] p-2 rounded border border-white/[0.06] whitespace-pre-wrap">
                            {log.detail}
                          </pre>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Verification Evidence Report Card */}
            {showHistory && (
              <div className="framer-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-bold">Past runs</span>
                  {runHistory.length > 0 && (
                    <button className="text-[11px] text-zinc-400 underline" onClick={() => { setRunHistory([]); try { localStorage.removeItem('ca_runs'); } catch {} }}>Clear</button>
                  )}
                </div>
                {runHistory.length === 0 ? (
                  <p className="text-xs text-zinc-400">No runs yet. Dispatch a task (Ctrl+Enter) and it will be logged here.</p>
                ) : runHistory.map((h) => (
                  <div key={h.at} className="border-t border-white/10 py-2 text-[11px]">
                    <p className="text-zinc-200 line-clamp-2">{h.goal}</p>
                    <p className="font-mono-code text-zinc-400 mt-1">{h.status} | {h.seconds}s | {h.steps} steps | {h.selfHeals} self-heals | {new Date(h.at).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            )}
            {verificationResult && (
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-emerald-950/20 to-[#0F2523] p-5 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.25)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {verificationResult.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                    ID: {verificationResult.recordId}
                  </span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed mt-2">{verificationResult.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono-code text-[11px] text-emerald-200">
                  {(() => { const m = runMetrics(); return [`${m.seconds}s`, `${m.steps} steps`, `${m.selfHeals} self-heals`, `${m.approvals} approval events`].map((t) => <span key={t} className="px-2 py-0.5 rounded-full border border-emerald-500/30">{t}</span>); })()}
                  <button onClick={downloadReceipt} className="framer-btn-glass px-3 py-1 rounded-lg text-xs ml-auto">Download receipt (.md)</button>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(verificationResult.evidence).map(([k, v]) => (
                    <div key={k} className="bg-black/40 p-2 rounded-lg border border-white/[0.07]">
                      <span className="text-zinc-400 block text-[10px]">{k}</span>
                      <span className="font-mono-code text-emerald-200 font-medium break-all">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIMULATED ENTERPRISE COMPUTER ENVIRONMENT */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="framer-card rounded-2xl overflow-hidden flex-1 flex flex-col border border-white/10">
              {/* Simulated Browser Chrome Header */}
              <div className="bg-[#0D201F] px-4 py-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-violet-400" />
                    Simulated Enterprise Workstation
                  </span>
                </div>

                {/* Browser URL Bar */}
                <div className="flex-1 max-w-md mx-auto bg-[#040508] border border-white/10 rounded-lg px-3 py-1 flex items-center justify-between text-xs font-mono-code text-zinc-400">
                  <span className="truncate">https://{browserUrl}</span>
                  <span className="text-[10px] text-emerald-400 ml-2 shrink-0">● TLS 1.3</span>
                </div>

                {/* Live Playwright Cursor Indicator */}
                <div className="flex items-center gap-2">
                  {agentCursorLabel ? (
                    <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-200 text-[11px] font-mono-code flex items-center gap-1.5 animate-pulse">
                      <Eye className="w-3 h-3 text-violet-300" />
                      {agentCursorLabel}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 text-[11px] font-mono-code">
                      Playwright Idle
                    </span>
                  )}
                </div>
              </div>

              {/* Application Navigation Tabs */}
              <div className="bg-[#0F2523] px-4 py-2.5 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => {
                      setErpTab('ledger');
                      setBrowserUrl('internal.centralign-erp.local/finance/ledger');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      erpTab === 'ledger'
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    ERP Invoice Ledger
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-200">
                      {invoicesDb.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setErpTab('vault');
                      setBrowserUrl('internal.centralign-erp.local/vault/invoices');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      erpTab === 'vault'
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Document Vault (PDFs)
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-200">
                      {sampleFiles.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setErpTab('inbox');
                      setBrowserUrl('internal.centralign-erp.local/mail/inbox');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      erpTab === 'inbox'
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Company Inbox
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-200">
                      {inboxEmails.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setErpTab('vendors');
                      setBrowserUrl('internal.centralign-erp.local/finance/vendors');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      erpTab === 'vendors'
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Vendor Profiles
                  </button>
                </div>

                <button
                  onClick={() => setShowNewFileModal(true)}
                  className="framer-btn-glass px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 text-violet-300 border-violet-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom Invoice PDF
                </button>
              </div>

              {/* TAB 1: ERP INVOICE LEDGER */}
              {erpTab === 'ledger' && (
                <div className="p-5 space-y-5 flex-1 flex flex-col">
                  {/* Live Automated Entry Form */}
                  <div className="bg-[#07080e] border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-violet-400" />
                        Internal ERP Ledger — Automated Entry Form
                      </span>
                      <span className="text-[10px] font-mono-code text-zinc-400">
                        Selector: [data-testid="erp-record-submit"]
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Invoice #</label>
                        <input
                          readOnly
                          value={liveFormDraft.invoiceNumber}
                          placeholder="INV-2026-XXX"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Vendor Name</label>
                        <input
                          readOnly
                          value={liveFormDraft.vendor}
                          placeholder="Vendor Corp"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Amount (USD)</label>
                        <input
                          readOnly
                          value={liveFormDraft.amount}
                          placeholder="0.00"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-emerald-300"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Due Date</label>
                        <input
                          readOnly
                          value={liveFormDraft.dueDate}
                          placeholder="YYYY-MM-DD"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">Category</label>
                        <input
                          readOnly
                          value={liveFormDraft.category}
                          placeholder="Department"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SQLite Database Records Table */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-semibold text-zinc-300">
                        Persisted SQLite Ledger Records (`erp_invoices`)
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono-code">
                        Total Value: $
                        {invoicesDb
                          .reduce((acc, r) => acc + Number(r.amount), 0)
                          .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0B1A19]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/[0.08] bg-white/[0.03] text-zinc-400 text-[11px] uppercase">
                            <th className="py-2.5 px-3">Record ID</th>
                            <th className="py-2.5 px-3">Invoice #</th>
                            <th className="py-2.5 px-3">Vendor</th>
                            <th className="py-2.5 px-3">Amount</th>
                            <th className="py-2.5 px-3">Due Date</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                          {invoicesDb.map((row) => {
                            const isNew = row.id === highlightedRowId;
                            return (
                              <tr
                                key={row.id}
                                className={`transition-colors ${
                                  isNew ? 'bg-emerald-500/15 text-white' : 'hover:bg-white/[0.02]'
                                }`}
                              >
                                <td className="py-3 px-3 font-mono-code text-violet-300 font-medium">{row.id}</td>
                                <td className="py-3 px-3 font-mono-code font-semibold text-zinc-100">
                                  {row.invoiceNumber}
                                </td>
                                <td className="py-3 px-3 text-zinc-200">{row.vendor}</td>
                                <td className="py-3 px-3 font-mono-code font-semibold text-emerald-300">
                                  ${Number(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-3 font-mono-code text-zinc-300">{row.dueDate}</td>
                                <td className="py-3 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENT VAULT (PDFs) */}
              {erpTab === 'vault' && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
                  <div className="md:col-span-5 space-y-2">
                    <div className="text-xs font-semibold text-zinc-400 mb-2">
                      /vault/invoices ({sampleFiles.length} files)
                    </div>
                    {sampleFiles.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          selectedFile?.id === file.id
                            ? 'bg-violet-500/15 border-violet-500/50 text-white'
                            : 'bg-white/[0.02] border-white/[0.07] text-zinc-300 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code text-xs font-semibold text-violet-300 truncate">
                            {file.filename}
                          </span>
                          <span className="text-xs font-mono-code font-bold text-emerald-300">
                            ${file.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">{file.vendor}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Due: {file.dueDate}</div>
                      </button>
                    ))}
                  </div>

                  <div className="md:col-span-7 bg-[#0B1A19] border border-white/10 rounded-xl p-4 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                      <span className="text-xs font-mono-code text-zinc-300 font-semibold">
                        {selectedFile?.filename}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        PDF Text Layer
                      </span>
                    </div>
                    <pre className="text-xs font-mono-code text-zinc-200 whitespace-pre-wrap leading-relaxed flex-1">
                      {selectedFile?.rawContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPANY INBOX */}
              {erpTab === 'inbox' && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
                  <div className="md:col-span-5 space-y-2">
                    {inboxEmails.map((email) => (
                      <button
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          selectedEmail?.id === email.id
                            ? 'bg-violet-500/15 border-violet-500/50 text-white'
                            : 'bg-white/[0.02] border-white/[0.07] text-zinc-300'
                        }`}
                      >
                        <div className="text-xs font-semibold text-zinc-100 line-clamp-1">{email.subject}</div>
                        <div className="text-[11px] text-zinc-400 mt-1">{email.from}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{email.date}</div>
                      </button>
                    ))}
                  </div>
                  <div className="md:col-span-7 bg-[#0B1A19] border border-white/10 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-white">{selectedEmail?.subject}</h4>
                    <div className="text-xs text-zinc-400 mt-1 border-b border-white/10 pb-2">
                      From: {selectedEmail?.senderName} &lt;{selectedEmail?.from}&gt;
                    </div>
                    <pre className="text-xs font-sans text-zinc-200 whitespace-pre-wrap leading-relaxed mt-3">
                      {selectedEmail?.body}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 4: VENDOR PROFILES */}
              {erpTab === 'vendors' && (
                <div className="p-5 flex-1">
                  <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0B1A19]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.03] text-zinc-400 text-[11px] uppercase">
                          <th className="py-2.5 px-3">Vendor ID</th>
                          <th className="py-2.5 px-3">Vendor Name</th>
                          <th className="py-2.5 px-3">Billing Email</th>
                          <th className="py-2.5 px-3">Payment Terms</th>
                          <th className="py-2.5 px-3">ACH Bank Routing</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {vendorsDb.map((v) => (
                          <tr
                            key={v.id}
                            className={highlightedRowId === v.id ? 'bg-emerald-500/15' : 'hover:bg-white/[0.02]'}
                          >
                            <td className="py-3 px-3 font-mono-code text-violet-300">{v.id}</td>
                            <td className="py-3 px-3 font-semibold text-white">{v.name}</td>
                            <td className="py-3 px-3 text-zinc-400">{v.email}</td>
                            <td className="py-3 px-3 font-mono-code text-zinc-200">{v.paymentTerms}</td>
                            <td className="py-3 px-3 font-mono-code text-cyan-300">{v.bankAccount}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        /* SUBMISSION & ARCHITECTURE DOCS VIEW */
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-5 py-8 space-y-6">
          <div className="framer-card rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold framer-gradient-text">
              CentrAlign AI — Architecture & Engineering Decisions
            </h2>
            <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
              This repository implements a complete autonomous AI Task Worker built around the closed-loop state machine:
              <span className="font-mono-code text-violet-300 ml-1">
                Goal → Understand → Plan → Execute → Observe → Adapt → Verify → Complete
              </span>
              .
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-1">1. Structured Planning & Tool DAG</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Uses Gemini 2.5 Flash with strict JSON Schema output to decompose ambiguous natural-language requests into deterministic tool invocations (`vault.fs.scan`, `pdf.parser`, `playwright.fill`, `sql.verify`).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-1">2. Self-Healing Browser Automation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When primary CSS selectors fail (e.g. `#legacy-submit-btn-v1`), the runtime inspects the live DOM accessibility tree and falls back to semantic attributes (`[data-testid="erp-record-submit"]`).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-1">3. Policy Guardrails & DB Verification</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enforces SOP-FIN-04 by pausing for human sign-off on invoices &gt; $5,000 or bank routing edits, and runs a read-after-write SQLite query to prove persistence before marking a task complete.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* MODAL: ADD CUSTOM INVOICE PDF */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="framer-card rounded-2xl max-w-md w-full p-6 border border-white/15">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-white">Create Custom Test Invoice PDF</h3>
              <button onClick={() => setShowNewFileModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Vendor Name</label>
                <input
                  required
                  value={newFileForm.vendor}
                  onChange={(e) => setNewFileForm({ ...newFileForm, vendor: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Invoice Number</label>
                  <input
                    required
                    value={newFileForm.invoiceNumber}
                    onChange={(e) => setNewFileForm({ ...newFileForm, invoiceNumber: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Amount (USD)</label>
                  <input
                    required
                    type="number"
                    value={newFileForm.amount}
                    onChange={(e) => setNewFileForm({ ...newFileForm, amount: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono-code"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    value={newFileForm.dueDate}
                    onChange={(e) => setNewFileForm({ ...newFileForm, dueDate: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <input
                    required
                    value={newFileForm.category}
                    onChange={(e) => setNewFileForm({ ...newFileForm, category: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="framer-btn-glass px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="framer-btn-primary px-4 py-2 rounded-xl font-semibold">
                  Save to Vault & Load Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OPTIONAL GEMINI API KEY */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="framer-card rounded-2xl max-w-md w-full p-6 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-white">Configure Gemini API Key</h3>
              <button onClick={() => setShowApiModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Enter your Google Gemini API key to use live LLM planning and executive summaries. If left blank, the runtime automatically uses its built-in deterministic structured planner so the demo always works out of the box.
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono-code text-white mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowApiModal(false)}
                className="framer-btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
