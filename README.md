# 🎯 Simulador de Entrevistas Laborales con Retroalimentación

Este proyecto tiene como objetivo ayudar a estudiantes universitarios a prepararse para entrevistas de trabajo mediante un entorno interactivo que:

- Simula preguntas reales según diferentes áreas profesionales.
- Permite grabar respuestas en **video** o **texto**.
- Ofrece retroalimentación automática y personalizada para mejorar el desempeño.

---

## 📚 Contexto

Desarrollado para un centro universitario de empleabilidad, este simulador brinda a los estudiantes una experiencia práctica y profesional en entrevistas laborales. Las funcionalidades principales incluyen:

- Presentación de preguntas comunes según el área profesional seleccionada (por ejemplo: soporte técnico, atención al cliente, desarrollo de software).
- Registro de respuestas en **formato video o texto**.
- Retroalimentación automática basada en análisis de palabras clave, tono y estructura de la respuesta.
- Posibilidad de recibir comentarios personalizados por parte de **mentores o docentes**.
- Opción para que los usuarios sugieran nuevos roles profesionales, proporcionando:
  - Nombre del puesto
  - Habilidades deseadas
  - Ejemplos de preguntas para entrevistas

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React
- **Backend:** Node.js (versión 22 o superior)  
  [Descargar Node.js](https://nodejs.org/en/download/current)
- **Base de Datos:** MySQL  
  [Descargar MySQL](https://dev.mysql.com/downloads/mysql/)

---

## 🚀 Cómo Descargar y Ejecutar el Proyecto

Sigue estos pasos para descargar, instalar y preparar el entorno del simulador de entrevistas laborales.


- Primero, clona el repositorio del proyecto:

```bash
git clone https://github.com/JulioCesarGutierrezRojas/SDETCR.git
```
- Luego, tanto en la carpeta de **backend** como **frontend** ejecuta el siguiente comando:

```bash
npm i
```

ó

```bash
npm install
```

- Ahora dentro de estas mismas carpetas, en cada una, crea un archivo **.env** el cual contendra las variables de entorno para que el proyecto funcione

- Para poder ejecutar el **backend**, dentro de esta carpeta y por terminal ejecuta el siguiente comando:

```bash
node --watch ./src/index
```

- Para poder ejecutar el **frontend**, de igual manera dentro de esta carpeta y por terminal ejecuta el siguiente comando:

```bash
npm run dev
```

---

## 📂 Estructura de Carpetas

**Carpetas de Backend**

- backend/
    - data/
    - docs/
    - src/
      - assets/
      - config/
      - kernel/
      - modules/
        - modulo/  <!-- reemplaza con el nombre real del módulo -->
          - controller/
            - dto/
          - model/
          - service/
      - security/
      - index.js
    - tests/
    - .gitignore
    - package.json

**Carpetas de Frontend**

- frontend/
    - data/
    - docs/
    - public/
    - src/
      - assets/
      - components/
      - config/
      - kernel/
      - modules/
        - modulo/
          - adapter/
          - components/
          - views/
      - router/
      - styles/
      - index.css
      - main.jsx
    - tests/
    - .gitignore
    - package.json

