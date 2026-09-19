---
description: Default lean workflow for normal product development.
---

# FAST

1. Anchor the relevant spec.
2. Define the smallest complete vertical slice.
3. Invoke one relevant implementation agent.
4. Add/run focused tests only for meaningful behavior.
5. Run build/typecheck for the touched area.
6. Use a concise reviewer only when the change is non-trivial.
7. Fix real findings.
8. Update one report file.
9. Finish.

Do not require test-first for cosmetic or straightforward CRUD work.
Do not invoke security/spec auditors unless risk justifies it.
