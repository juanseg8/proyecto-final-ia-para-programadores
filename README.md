# Agro Intelligence Network 🚜

Agro Intelligence Network es una plataforma colaborativa y mobile-first (MVP) diseñada para productores ganaderos. Su objetivo principal es ofrecer un **benchmarking anónimo** de indicadores productivos (como la Ganancia Media Diaria o GMD), complementado con herramientas avanzadas de **Inteligencia Artificial** que interpretan los datos y el contexto.

## 📖 Historia del Desarrollo (Co-Work con IAs)

Este proyecto es el resultado de un flujo de trabajo altamente iterativo e innovador impulsado por Inteligencia Artificial:

1. **Génesis Multi-Agente (Python + Aider):** La arquitectura base, el modelo de datos y las primeras discusiones técnicas se diseñaron utilizando un entorno multi-agente local en Python. A través de la herramienta **Aider**, pusimos a interactuar a distintos modelos de IA para debatir arquitecturas, esquemas de bases de datos y estrategias de diseño orientadas al dominio ganadero.
2. **Consolidación y Desarrollo Full-Stack (Antigravity):** Una vez definida la estructura y tras transicionar a una arquitectura SDD (Software Driven Development), el desarrollo real y completo del código se llevó a cabo trabajando mano a mano con el agente avanzado **Antigravity**. Este co-work nos permitió escribir en tiempo real el backend en NestJS, el frontend en React Native (Expo), depurar problemas de red (como configurar IPs compartidas para probar en teléfonos físicos) y ajustar de forma dinámica las políticas de *Guardrails* e integraciones con OpenRouter, recortando lo que hubieran sido meses de desarrollo a horas de iteración intensiva.

## 🏗️ Estructura del Repositorio

- `/backend`: Contiene la API REST desarrollada en **NestJS** y **TypeScript**.
- `/mobile`: Contiene la aplicación móvil desarrollada en **React Native**, **Expo** y **TypeScript**.
- `/specs`: Contiene especificaciones técnicas, entre las que destaca `arquitectura.md`, un diagrama generado en código Mermaid que ilustra el flujo completo entre capas, diseñado específicamente por IA.
- `/diagramas_archify`: Contiene exportaciones estáticas (HTML/JSON) de diagramas de arquitectura, secuencias y flujos de trabajo de alto nivel generados durante la etapa de diseño de arquitectura.
- `docker-compose.yml`: Archivo de configuración para levantar la base de datos PostgreSQL en un entorno local aislado.

## 🧠 ¿Cómo funciona el Backend?

El backend, orquestado con **NestJS**, se encarga de la lógica dura y tradicional y de hacer de puente seguro con la Inteligencia Artificial.
- **Base de Datos y TypeORM:** Toda la persistencia de datos (Usuarios, Establecimientos, Rodeos, Animales, Eventos, Pesajes y Alertas) vive en **PostgreSQL**.
- **Cálculo Determinístico:** Indicadores como la Ganancia Media Diaria (GMD) se calculan en el servidor y nunca por la IA.
- **Integración AI (`gpt-4o-mini` vía OpenRouter):** El backend expone un conjunto de *Tools* (herramientas cerradas) que le entregan a la IA los datos del establecimiento en formato JSON. El modelo de lenguaje actúa únicamente para interpretar estos números en lenguaje natural.
- **Guardrails:** Para evitar diagnósticos veterinarios y cuidar que la IA no alucine (invente) números que no existen, un módulo de seguridad valida y filtra programáticamente cada respuesta de la IA antes de enviarla al cliente.
- **Integración de Clima y Mapas:** Dependiendo de las coordenadas (latitud/longitud) cargadas en cada establecimiento, el backend se conecta con una API externa meteorológica para obtener el clima actual y usarlo como contexto para las alertas y la IA.

## 📱 ¿Cómo funciona la App Móvil?

Desarrollada en **React Native + Expo**, la app está pensada para ser utilizada por productores ganaderos "en el campo". 
- Es el único punto de entrada de datos (pesajes, eventos, altas de rodeos).
- Muestra un Dashboard central donde se consume la API para visualizar el estado general (clima, alertas críticas, benchmarking en tiempo real).
- Incluye una interfaz de chat estilo "Asistente IA", donde el usuario consulta por sus indicadores y recibe consejos agronómicos formateados prolijamente (con emojis y textos estructurados), procesados por el backend.

---

## 🚀 Guía de Instalación y Ejecución Local

Para probar el proyecto completo en tu computadora, sigue estos pasos:

### 1. Base de Datos (Docker)
En la raíz del proyecto, levanta la base de datos PostgreSQL usando Docker:
```bash
docker-compose up -d
```
*Esto iniciará un contenedor de PostgreSQL en el puerto 5432.*

### 2. Backend (NestJS)
Abre una terminal y dirígete a la carpeta del backend:
```bash
cd backend
npm install
```
Asegúrate de copiar el archivo de entorno y configurar tus credenciales (como la `AI_API_KEY` de OpenRouter si vas a probar el chat IA):
```bash
cp .env.example .env
```
Luego, inicia el servidor en modo desarrollo:
```bash
npm run start:dev
```
*El backend quedará corriendo en http://localhost:3000.*

### 3. Frontend Mobile (Expo)
Abre otra terminal y dirígete a la carpeta mobile:
```bash
cd mobile
npm install
```
Asegúrate de configurar la IP correcta de tu máquina para que el teléfono o emulador pueda alcanzar el backend local:
```bash
cp .env.example .env
# IMPORTANTE: Cambia "localhost" en .env por la IP IPv4 local de tu PC (ej: 192.168.0.x)
```
Inicia el servidor de Expo:
```bash
npx expo start -c
```
*Escanea el código QR desde tu celular con la app de **Expo Go** (iOS/Android), o presiona `a` para abrirlo en un emulador de Android / `i` para el simulador de iOS.*

### 4. Datos de Prueba (Seed)
El proyecto incluye un script para poblar la base de datos con información realista (establecimientos, rodeos, animales, pesajes, eventos) para poder probar el dashboard, el mapa y la Inteligencia Artificial de inmediato.

En la terminal del backend, ejecuta:
```bash
npm run seed
```

**Credenciales de prueba para iniciar sesión en la App:**
- **Email:** `demo@agro.com`
- **Contraseña:** `123456`
