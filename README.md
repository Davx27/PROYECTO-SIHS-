# Sistema de Información SIHS 🚀

El **Sistema de Información SIHS** es una plataforma web desarrollada con una arquitectura basada en API REST y desacoplada mediante un enfoque de **Monorepo**. Este repositorio contiene tanto el servidor Backend como el cliente Frontend, garantizando un desarrollo modular, escalable y mantenible.

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
* **Servidor ASGI:** Uvicorn
* **Modelado y ORM:** SQLAlchemy / Pydantic
* **Autenticación:** JWT (JSON Web Tokens)
* **Base de Datos:** PostgreSQL

### **Frontend**
* **Librería/Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Lenguaje:** TypeScript
* **Estilos:** TailwindCSS
* **Cliente HTTP:** Axios

### **Infraestructura y Herramientas**
* **Control de Versiones:** Git & GitHub
* **Contenedores:** Docker / Docker Compose
* **Pruebas de API:** Postman

---

## 📁 Estructura del Proyecto (Monorepo)

```text
PROYECTO-SIHS/
├── backend/                  # Servidor de API REST (FastAPI)
│   ├── app/
│   │   ├── api/              # Endpoints y rutas de la API
│   │   ├── core/             # Configuraciones globales y seguridad JWT
│   │   ├── db/               # Conexión y sesión de PostgreSQL
│   │   ├── models/           # Modelos de base de datos (SQLAlchemy)
│   │   ├── schemas/          # Esquemas de validación (Pydantic)
│   │   └── services/         # Lógica de negocio
│   ├── main.py               # Punto de entrada de la aplicación FastAPI
│   └── requirements.txt      # Dependencias de Python
│
├── frontend/                 # Cliente Web (React + Vite + TypeScript)
│   ├── src/
│   │   ├── assets/           # Archivos estáticos e imágenes
│   │   ├── components/       # Componentes de UI reutilizables
│   │   ├── context/          # Estados globales (ej. Autenticación)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── pages/            # Vistas/Pantallas del sistema
│   │   ├── routes/           # Configuración y protección de rutas
│   │   ├── services/         # Integración de API (Axios)
│   │   └── types/            # Definiciones de tipos en TypeScript
│   └── package.json          # Dependencias de Node.js
│
├── database/                 # Configuración e inicialización de la BD
│   └── docker-compose.yml
│
├── .gitignore                # Archivos e itinerarios excluidos de Git
└── README.md                 # Documentación principal del proyecto
⚙️ Configuración e Instalación Local
Requisitos Previos
Node.js (versión 18 o superior)

Python (versión 3.10 o superior)

Git

1. Clonar el Repositorio
Bash
git clone <URL_DEL_REPOSITORIO>
cd PROYECTO-SIHS
2. Configuración del Backend
Entrar a la carpeta del backend:

Bash
cd backend
Crear el entorno virtual:

Bash
# En Windows:
python -m venv venv
.\venv\Scripts\activate

# En Linux/Mac:
python3 -m venv venv
source venv/bin/activate
Instalar las dependencias:

Bash
python -m pip install --upgrade pip
pip install -r requirements.txt
Iniciar el servidor de desarrollo:

Bash
uvicorn main:app --reload
El backend estará corriendo en: http://127.0.0.1:8000

Documentación interactiva Swagger: http://127.0.0.1:8000/docs

3. Configuración del Frontend
Abrir una nueva terminal y entrar a la carpeta del frontend:

Bash
cd frontend
Instalar dependencias de Node:

Bash
npm install
Iniciar el servidor de desarrollo:

Bash
npm run dev
El frontend estará corriendo en: http://localhost:5173

🌿 Flujo de Trabajo en Git
Para mantener la estabilidad del código, el equipo utiliza una estrategia de ramificación basada en tareas cortas:

main: Código en versión final y funcional. No se trabaja directamente sobre esta rama.

develop: Rama principal de integración diaria.

Ramas por Tarea (feature/*): Cada integrante crea una rama corta partiendo de develop para desarrollar un módulo o pantalla específica (ej. front/login, back/auth-jwt).

Comandos Frecuentes:
Bash
# Sincronizar develop antes de iniciar una tarea
git checkout develop
git pull origin develop

# Crear una nueva rama para una tarea
git checkout -b front/nombre-tarea

# Subir cambios e integrar vía Pull Request en GitHub
git add .
git commit -m "Descripción clara del cambio"
git push -u origin front/nombre-tarea
📝 Licencia y Autores
Proyecto desarrollado como parte del programa de formación Tecnológica en Análisis y Desarrollo de Software (ADSO) - SENA.