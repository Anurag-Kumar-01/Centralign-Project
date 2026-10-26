## What's new in v3

- **New look ("Ledger Felt")**: green accounting-desk surface, ruled-paper lines, hard-shadow stamp buttons, Bricolage Grotesque + Instrument Sans + DM Mono. Colours live in one place: the `tailwind.config` block in `index.html` (palette remap) and `src/styles/framer-theme.css`.
- **Evidence receipt**: after a verified run, download a Markdown receipt (task, outcome, evidence, plan, full audit trail).
- **Run metrics + history**: time, steps, self-heals, approval events per run; last 12 runs kept in localStorage.
- **Ctrl/Cmd+Enter** dispatches the task.
- **Backend link chip**: header shows whether `server/agent-worker.js` is reachable.
- **Server**: `GET /api/health`, `/api/audit`, `/api/invoices`; exponential backoff between selector fallbacks.

Note: Tailwind is loaded from the CDN in `index.html`, so `tailwind.config.js` is not used at runtime.

# CentrAlign AI — Autonomous AI Task Worker (Framer Dark Edition)

An end-to-end autonomous AI Task Worker prototype built for the **CentrAlign AI Engineering Hiring Challenge**.
Designed with a **Framer / Linear inspired glassmorphic dark UI**, this system accepts natural-language business objectives, synthesizes multi-step execution plans, operates a simulated enterprise ERP & document environment, recovers from DOM selector failures, enforces Human-in-the-Loop (HITL) policy guardrails, and performs read-after-write SQLite verification.

---

## 1. Core Execution Loop Architecture

```
+-----------------------------------------------------------------------------------+
|                        CENTRALIGN AI AUTONOMOUS RUNTIME                           |
|                                                                                   |
|  [1. GOAL] ---> [2. UNDERSTAND] ---> [3. PLAN (DAG)] ---> [4. EXECUTE (Tools)]    |
|                                                                  |                |
|  [8. COMPLETE] <--- [7. VERIFY (SQL)] <--- [6. ADAPT / HITL] <--- [5. OBSERVE]    |
+-----------------------------------------------------------------------------------+
         |                       |                        |
         v                       v                        v
  +--------------+      +-----------------+      +------------------+
  | Document     |      | Playwright DOM  |      | SQLite ERP DB    |
  | Vault & Mail |      | Automation      |      | Read-After-Write |
  +--------------+      +-----------------+      +------------------+
```

---

## 2. Quick Start & Run Instructions

### Option A: Instant Zero-Build Preview (Fastest)
Simply double-click **`preview-standalone.html`** in any modern browser (Chrome, Edge, Brave, Safari). It loads the entire Framer-themed interactive workspace immediately without requiring `npm install`.

### Option B: Full Local Development Stack (Vite + React + Node.js Backend)
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the Frontend Workspace:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
3. **Start the Node.js + SQLite + Playwright Worker (Optional Backend Server):**
   ```bash
   npm run server
   ```
4. **Configure Gemini API Key (Optional):**
   Click the **"API Key"** button in the top navigation bar (or copy `.env.example` to `.env` and set `GEMINI_API_KEY`). If no key is provided, the runtime seamlessly falls back to its built-in deterministic structured planner so every benchmark scenario works out of the box.

---

## 3. Key Engineering & Design Decisions

1. **Structured JSON Planning over Free-Text Chain-of-Thought:**
   Uses `gemini-2.5-flash` with `responseSchema` enforcement so every natural-language request is compiled into a deterministic sequence of typed tool invocations (`vault.fs.scan`, `pdf.parser`, `policy.evaluate`, `playwright.fill`, `sql.verify`).
2. **Self-Healing DOM Automation (`Adapt` Stage):**
   Enterprise web apps frequently change CSS classes or button IDs. When the primary selector `#legacy-submit-btn-v1` times out, the worker inspects the DOM accessibility tree, discovers `[data-testid="erp-record-submit"]`, and retries automatically.
3. **Policy-Driven Human-in-the-Loop Gate (`SOP-FIN-04`):**
   Autonomy without guardrails is dangerous in enterprise finance. Invoices exceeding `$5,000` (e.g., NovaTech AI Labs at `$14,800`) or mutations to vendor ACH bank routing numbers automatically pause execution and surface a structured approval prompt to the human supervisor.
4. **Read-After-Write Verification (`Verify` Stage):**
   An HTTP 200 or button click does not guarantee database persistence. The agent queries the SQLite ledger after submission and compares the persisted row against extracted entities before marking the task `VERIFIED & COMPLETED`.

---

## 4. Known Limitations & Future Improvements

- **Current Limitations:**
  - PDF parsing currently operates on structured text layers rather than vision-based OCR for scanned/handwritten invoices.
  - Browser automation targets the sandboxed ERP workspace rather than arbitrary third-party external websites with CAPTCHAs/2FA.
- **What I Would Build Next:**
  - Multimodal Vision-Language DOM grounding (passing annotated screenshots to Gemini 2.5 Flash along with accessibility trees).
  - Persistent episodic memory so the agent remembers company-specific vendor aliases and past human corrections across sessions.
  - BullMQ / Redis background job queue for long-running asynchronous workflows.
