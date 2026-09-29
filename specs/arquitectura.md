# Arquitectura de Agro Intelligence Network

Copiá el siguiente bloque de código y pegalo en [mermaid.live](https://mermaid.live) para ver el diagrama generado automáticamente y poder descargarlo como imagen PNG en alta calidad para tu informe.

```mermaid
graph TD
    %% Estilos personalizados de alto contraste y diseño prolijo
    classDef user fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b,font-weight:bold
    classDef frontend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20,font-weight:bold
    classDef backend fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100,font-weight:bold
    classDef db fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c,font-weight:bold
    classDef external fill:#eceff1,stroke:#546e7a,stroke-width:2px,color:#263238,font-weight:bold
    classDef service fill:#fffde7,stroke:#fbc02d,stroke-width:2px,color:#f57f17,font-weight:bold

    %% Nodos principales
    U(("👨‍🌾 Productor\n(Usuario)")):::user
    
    subgraph Capa_Cliente ["📱 Capa Frontend (Mobile)"]
        direction TB
        APP["App Móvil\n(React Native + Expo)"]:::frontend
        MAP["Mapa y Ubicación\n(Coordenadas GPS)"]:::frontend
    end
    
    subgraph Capa_Servidor ["⚙️ Capa Backend (API REST)"]
        direction TB
        API["API NestJS\n(Auth, Lógica, Ruteo IA)"]:::backend
        BIZ["Servicios de Negocio\n(Indicadores, Alertas, Benchmark)"]:::service
        WEATHER["Servicio de Clima\n(Consulta Lat/Long)"]:::service
    end
    
    subgraph Capa_Datos ["🗄️ Persistencia"]
        DB[("PostgreSQL\n(TypeORM)")]:::db
    end
    
    subgraph Capa_IA ["🧠 Inteligencia Artificial"]
        LLM["OpenRouter\n(gpt-4o-mini)"]:::external
    end

    %% Relaciones y flujo de datos
    U -->|Interactúa| APP
    APP -->|Solicita Permisos| MAP
    APP <-->|HTTPS / JSON + JWT| API
    
    API -->|Ejecuta lógica determinística| BIZ
    API -->|Consulta externa| WEATHER
    
    API <-->|Lee/Escribe (SQL)| DB
    BIZ <-->|Genera Snapshots| DB
    
    API <-->|Contexto Validado + Tools| LLM
```
