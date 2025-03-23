# Project Name

## Overview
This project consists of a **Next.js** frontend managed with **pnpm** and a **FastAPI** backend running in a Python virtual environment (venv).

## Tech Stack
- **Frontend:** Next.js, TypeScript, pnpm, Tailwind CSS
- **Backend:** FastAPI, Python, venv
- **Package Manager:** pnpm (for frontend), pip (for backend)

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <repo_url>
cd <repo_directory>
```

### 2. Setup the Frontend (Next.js with pnpm)
```sh
cd frontend
pnpm install
```

#### Run the Frontend
```sh
pnpm dev
```
This will start the Next.js development server at `http://localhost:3000`.

---

### 3. Setup the Backend (FastAPI with venv)
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

pip install -r requirements.txt
```

#### Run the Backend
```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
This will start the FastAPI server at `http://localhost:8000`.

---

## API Documentation
Once the backend is running, you can access API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

---

## Environment Variables
Create a `.env` file in both `frontend/` and `backend/` directories as needed.

For **frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For **backend** (`.env`):
```env
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./database.db
```

---

## Deployment
### Frontend
To build the Next.js app:
```sh
pnpm build
```

### Backend
To run the FastAPI app in production:
```sh
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## License
This project is licensed under the MIT License.

