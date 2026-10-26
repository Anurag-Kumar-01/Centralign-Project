# CentrAlign AI — Technical Walkthrough & Interview Guide

## 2-Minute Demo Video Script
1. **0:00 - 0:25 (Introduction & Framer UI Overview):**
   "Hi, I built the CentrAlign AI Autonomous Task Worker. On the left is our Command & Telemetry Console showing the 8-stage loop (`Goal -> Understand -> Plan -> Execute -> Observe -> Adapt -> Verify -> Complete`), and on the right is our Simulated Enterprise Workstation containing an ERP Ledger, Document Vault, Company Inbox, and Vendor Profiles."
2. **0:25 - 1:00 (Scenario 1: Standard Autonomy + Self-Healing Retry):**
   Click Scenario 1 (*Process Latest Acme Cloud Invoice*) and press **Dispatch AI Worker**. Point out how the agent locates `INV-2026-089_AcmeCloud.pdf`, extracts `$4,250.00`, fills the live ERP form, encounters a simulated `#legacy-submit-btn-v1` selector failure, self-heals by switching to `[data-testid="erp-record-submit"]`, and runs a read-after-write verification query.
3. **1:00 - 1:35 (Scenario 2: Human-in-the-Loop Policy Gate):**
   Click Scenario 2 (*Process High-Value NovaTech Invoice - $14,800*). Show how the agent detects that `$14,800` exceeds the `$5,000` autonomous policy cap (`SOP-FIN-04`), pauses the Promise execution, and waits for you to click **Approve & Resume Execution**.
4. **1:35 - 2:00 (Generalization Test):**
   Click **+ Add Custom Invoice PDF** in the top-right of the workstation, create a brand-new invoice from any vendor, and run the agent on it to prove zero-shot generalization.
