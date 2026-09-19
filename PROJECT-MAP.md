# PROJECT MAP - Agro Intelligence Network

Este archivo evita exploraciones y rutas inventadas durante NIGHT_BUILD.
Regla: leer archivos concretos de este mapa. No hacer Read sobre directorios y no buscar specs alternativas.

## Root
- AGENTS.md
- OVERNIGHT-MVP.md
- MVP-EXECUTION-PLAN.md
- PROJECT-MAP.md
- NIGHT_REPORT.md
- README.md
- scripts/night-build.ps1

## Specs
- specs/constitution.md
- specs/000-index.md
- specs/features/F01-autenticacion.md
- specs/features/F02-Establecimiento.md
- specs/features/F03-gestion-ganadera.md
- specs/features/F04-indicadores.md
- specs/features/F05-benchmark-anonimo.md
- specs/features/F06-alertas.md
- specs/features/F07-clima.md
- specs/features/F08-agro-ia.md
- specs/features/F09-dashboard.md
- specs/ui/UX01-Design-System.md

## Backend existente
- backend/src/main.ts
- backend/src/app.module.ts
- backend/src/data-source.ts
- backend/src/auth/auth.module.ts
- backend/src/auth/auth.controller.ts
- backend/src/auth/auth.service.ts
- backend/src/auth/dto/auth.dto.ts
- backend/src/auth/guards/jwt-auth.guard.ts
- backend/src/auth/strategies/jwt.strategy.ts
- backend/src/entities/user.entity.ts
- backend/src/entities/session.entity.ts
- backend/src/entities/password-reset-token.entity.ts
- backend/src/entities/establishment.entity.ts
- backend/src/establishments/establishment.module.ts
- backend/src/establishments/establishment.controller.ts
- backend/src/establishments/establishment.service.ts
- backend/src/establishments/dto/create-establishment.dto.ts
- backend/src/establishments/dto/update-establishment.dto.ts
- backend/src/establishments/guards/establishment-ownership.guard.ts
- backend/src/db/migrations/1789258359975-F01Auth.ts
- backend/src/db/migrations/1789429739331-F02Establishment.ts

## Mobile existente
- mobile/App.tsx
- mobile/app.config.js
- mobile/app.json
- mobile/src/AuthContext.tsx
- mobile/src/apiClient.ts
- mobile/src/theme/theme.ts
- mobile/src/components/AppButton.tsx
- mobile/src/components/AppCard.tsx
- mobile/src/components/AppHeader.tsx
- mobile/src/components/AppInput.tsx
- mobile/src/components/AppScreen.tsx
- mobile/src/components/BottomNav.tsx
- mobile/src/components/FormField.tsx
- mobile/src/components/MapLocationPicker.tsx
- mobile/src/components/feedback.tsx
- mobile/src/components/index.ts
- mobile/src/services/georefService.ts
- mobile/src/screens/LoginScreen.tsx
- mobile/src/screens/RegisterScreen.tsx
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/EstablishmentListScreen.tsx
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/src/screens/EstablishmentDetailScreen.tsx

## Paths planificados F03
Crear exactamente:
- backend/src/entities/herd.entity.ts
- backend/src/entities/animal.entity.ts
- backend/src/entities/weighing.entity.ts
- backend/src/entities/livestock-event.entity.ts
- backend/src/livestock/livestock.module.ts
- backend/src/livestock/livestock.controller.ts
- backend/src/livestock/livestock.service.ts
- backend/src/livestock/dto/herd.dto.ts
- backend/src/livestock/dto/animal.dto.ts
- backend/src/livestock/dto/weighing.dto.ts
- backend/src/livestock/dto/livestock-event.dto.ts
- backend/src/db/migrations/1790000000000-F03Livestock.ts
- mobile/src/screens/LivestockScreen.tsx
- mobile/src/screens/HerdDetailScreen.tsx
- mobile/src/screens/CreateHerdScreen.tsx
- mobile/src/screens/CreateAnimalScreen.tsx
- mobile/src/screens/RegisterWeighingScreen.tsx
- mobile/src/screens/RegisterLivestockEventScreen.tsx

## Paths planificados F04
Crear exactamente:
- backend/src/entities/indicator-snapshot.entity.ts
- backend/src/indicators/indicators.module.ts
- backend/src/indicators/indicators.controller.ts
- backend/src/indicators/indicators.service.ts
- backend/src/db/migrations/1790000001000-F04Indicators.ts

## Paths planificados F05
Crear exactamente:
- backend/src/entities/benchmark-snapshot.entity.ts
- backend/src/benchmark/benchmark.module.ts
- backend/src/benchmark/benchmark.controller.ts
- backend/src/benchmark/benchmark.service.ts
- backend/src/benchmark/benchmark.config.ts
- backend/src/db/migrations/1790000002000-F05Benchmark.ts

## Paths planificados F06
Crear exactamente:
- backend/src/alerts/alerts.module.ts
- backend/src/alerts/alerts.controller.ts
- backend/src/alerts/alerts.service.ts
- backend/src/alerts/alerts.config.ts

## Paths planificados F07
Crear exactamente:
- backend/src/weather/weather.module.ts
- backend/src/weather/weather.controller.ts
- backend/src/weather/weather.service.ts
- backend/src/weather/open-meteo.provider.ts
- mobile/src/components/WeatherCard.tsx

## Paths planificados F08
Crear exactamente:
- backend/src/entities/ai-interaction.entity.ts
- backend/src/ai/ai.module.ts
- backend/src/ai/ai.controller.ts
- backend/src/ai/ai.service.ts
- backend/src/ai/ai-provider.service.ts
- backend/src/ai/ai-guardrails.service.ts
- backend/src/ai-audit/ai-audit.module.ts
- backend/src/ai-audit/ai-audit.service.ts
- backend/src/db/migrations/1790000003000-F08AiAudit.ts
- mobile/src/screens/AgroAiScreen.tsx

## Paths planificados F09
Crear exactamente:
- backend/src/dashboard/dashboard.module.ts
- backend/src/dashboard/dashboard.controller.ts
- backend/src/dashboard/dashboard.service.ts
- mobile/src/components/KpiCard.tsx
- mobile/src/components/BenchmarkCard.tsx
- mobile/src/components/AlertsCard.tsx

## Archivos de integración que pueden modificarse
- backend/src/app.module.ts
- backend/src/data-source.ts
- backend/src/entities/establishment.entity.ts
- backend/src/establishments/establishment.module.ts
- backend/src/establishments/establishment.controller.ts
- backend/src/establishments/establishment.service.ts
- mobile/App.tsx
- mobile/src/apiClient.ts
- mobile/src/components/index.ts
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/EstablishmentDetailScreen.tsx
- backend/.env.example
- mobile/.env.example

## Prohibido durante NIGHT_BUILD
- mobile/__tests__/**
- backend/**/*.spec.ts
- backend/test/**
- .agents/runs/**
- node_modules/**
- root src/**
