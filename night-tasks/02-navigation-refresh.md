# Night Task 02 - Navigation and refresh

## Goal
Stabilize existing F02 navigation and fresh data after CREATE/UPDATE/DELETE.

## Allowed
- mobile/**
- NIGHT_REPORT.md

## Do
- inspect current App/navigation/screens before editing;
- fix user-visible technical route names if they leak into UI;
- preserve canonical F02 routes/payload behavior;
- ensure CREATE refreshes establishment list;
- ensure UPDATE refreshes relevant detail/list state;
- ensure DELETE returns correctly and list is fresh;
- reuse existing navigation/refetch patterns;
- use existing tests as contract.

## Do not
- invent routes/features;
- alter backend;
- introduce timeout hacks;
- create root src/.

Update only Task 02 in NIGHT_REPORT.md and stop.
