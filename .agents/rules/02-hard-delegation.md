---
description: Hard Delegation applies only to STRICT workflows and tasks explicitly marked STRICT.
---

# Scope
Hard Delegation is no longer the default development mode.

It is mandatory only when:
- the selected mode is STRICT;
- a feature touches auth, ownership, security/privacy, benchmark anonymity, deterministic high-impact calculations, AI guardrails, or risky migrations;
- the human explicitly requests strict delegation.

FAST and UI_FAST follow their own lean workflows.

# STRICT-01 — Real delegation
If STRICT requires a specialist, use a real native subagent invocation. Never simulate a specialist.

# STRICT-02 — Separation of duties
In STRICT:
- test-autor owns functional tests;
- backend-dev/mobile-dev/feature-dev own implementation;
- spec-verificador audits spec compliance;
- revisor-seguridad audits security when applicable.

A developer must not weaken tests to obtain GREEN.

# STRICT-03 — Fail closed
If a required STRICT specialist cannot be invoked, stop that strict task and report the blocker. Do not silently downgrade it to FAST.

# STRICT-04 — Minimal evidence
Record one concise report under `.agents/runs/<feature>/report.md`.
Do not create one trace file per micro-step unless explicitly required.
