# Night Task 02 - Navigation and refresh

## Goal
Stabilize existing F02 navigation and fresh data after CREATE/UPDATE/DELETE.

## Allowed production area
- mobile/App.tsx
- mobile/src/screens/**
- mobile/src/components/**
- mobile/src/apiClient.ts
- NIGHT_REPORT.md

## Do
- inspect current navigation/screens before editing;
- preserve canonical F02 payload behavior;
- ensure CREATE returns to a fresh establishment list;
- ensure UPDATE refreshes the relevant detail/list state;
- ensure DELETE returns correctly and list is fresh;
- remove user-visible technical route names if present;
- reuse existing navigation/refetch patterns.

## Do not
- read/edit/create tests;
- alter backend;
- invent routes/features;
- add timeout hacks;
- create root src/.

Compile with TypeScript, update Task 02 in NIGHT_REPORT.md, then stop.
