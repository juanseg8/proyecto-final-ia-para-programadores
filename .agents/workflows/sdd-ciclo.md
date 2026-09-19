---
description: Lean mode router for feature implementation.
---

# /sdd-ciclo

1. Read the feature spec and touched invariants.
2. Select FAST, STRICT or UI_FAST using `.agents/rules/03-development-modes.md`.
3. Write a short PLAN only if the task spans multiple meaningful slices.
4. Execute:
   - FAST -> `.agents/workflows/feature-fast.md`
   - STRICT -> `.agents/workflows/strict.md`
   - UI_FAST -> `.agents/workflows/ui-fast.md`
5. Run the relevant gate once per completed slice.
6. Write one concise `.agents/runs/<ID>/report.md`.
7. Stop only for a real blocker, material product decision, or required human visual approval.
