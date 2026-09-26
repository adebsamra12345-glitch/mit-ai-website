# Frontend Restructuring Guide: Moving to `mit-ai-website/frontend`

This document provides a step-by-step DevOps guide to restructure the **mit-ai-website** project into a clean separated architecture:

```text
mit-ai-website/
  ├── backend/
  └── frontend/
```

---

## Overview of Changes

| Target | Items | Action |
| :--- | :--- | :--- |
| **Frontend Files** | `src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json` | Move into `frontend/` |
| **Build Artifacts & Dependencies** | `node_modules/`, `dist/` | Remove or move into `frontend/` (reinstall recommended) |
| **Root Configuration** | `.gitignore`, Root scripts | Update paths to recognize `frontend/` |
| **Backend** | `backend/` | **Untouched** (keeps existing structure) |

---

## Step 1: Create the `frontend` Directory

Navigate to the project root (`mit-ai-website`) and create the `frontend` folder.

### Linux / macOS / Git Bash:
```bash
mkdir frontend
```

### Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Path "frontend"
```

---

## Step 2: Move Frontend Files into `frontend/`

> **DevOps Best Practice (Git Tracking):** If you are using Git, use `git mv` so Git retains the complete commit history for all files.

### Option A: Using Git (Recommended)

#### Linux / macOS / Git Bash:
```bash
# Move source code and static assets
git mv src frontend/
git mv public frontend/

# Move Vite and HTML configuration
git mv index.html frontend/
git mv vite.config.js frontend/

# Move dependency manifests
git mv package.json frontend/
git mv package-lock.json frontend/
```

#### Windows (PowerShell with Git):
```powershell
git mv src frontend/
git mv public frontend/
git mv index.html frontend/
git mv vite.config.js frontend/
git mv package.json frontend/
git mv package-lock.json frontend/
```

---

### Option B: Using Standard File System Commands (Without Git)

#### Linux / macOS / Git Bash:
```bash
mv src public index.html vite.config.js package.json package-lock.json frontend/
```

#### Windows (PowerShell):
```powershell
Move-Item -Path "src", "public", "index.html", "vite.config.js", "package.json", "package-lock.json" -Destination "frontend"
```

---

### Step 2.1: Clean or Relocate `node_modules` and `dist`

Because `node_modules` contains symlinks and platform-specific binaries, moving it directly can cause lock issues or stale paths. The recommended approach is to remove old artifacts and run a clean install inside `frontend/`.

#### Linux / macOS / Git Bash:
```bash
rm -rf node_modules dist
cd frontend
npm install
cd ..
```

#### Windows (PowerShell):
```powershell
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules, dist
cd frontend
npm install
cd ..
```

---

## Step 3: Update Configurations and Paths

### 1. Update Root `.gitignore`
Update `.gitignore` in the project root to ensure files generated in `frontend/` are ignored:

```gitignore
# Frontend artifacts
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local

# Python & Django (existing backend)
backend/.venv/
.venv/
__pycache__/
*.py[cod]
backend/db.sqlite3
backend/.env
backend/.env.local
```

---

### 2. Clean Up `frontend/package.json` Scripts
Previously, `package.json` in the root had backend helper scripts pointing to `backend/...`. Now that `package.json` resides inside `frontend/`, remove backend-specific commands from `frontend/package.json` so it remains focused solely on frontend concerns:

```json
{
  "name": "mit-ai-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

---

### 3. Verify `frontend/vite.config.js`
The proxy configuration inside `vite.config.js` routes API requests over HTTP to the backend server:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
```
> **Note:** Because the proxy targets a local network port (`http://127.0.0.1:8000`), the proxy settings remain fully functional without requiring path adjustments.

---

## Step 4: Verification and Testing

Verify that both services run seamlessly in the new directory structure:

### Terminal 1: Backend Service
```bash
cd backend
# Windows:
.venv\Scripts\python.exe manage.py runserver 8000
# Linux / macOS:
# source .venv/bin/activate && python manage.py runserver 8000
```

### Terminal 2: Frontend Service
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` (or the URL output by Vite) in your browser and verify:
1. React frontend renders correctly.
2. Network calls to `/api/...` successfully route to Django at `http://127.0.0.1:8000`.

---

## Step 5: (Optional DevOps Enhancement) Root Automation Scripts

To allow running both frontend and backend from the root directory, you can optionally create a lightweight `package.json` at the root (`mit-ai-website/package.json`):

```json
{
  "name": "mit-ai-website-root",
  "private": true,
  "scripts": {
    "frontend:dev": "npm --prefix frontend run dev",
    "frontend:build": "npm --prefix frontend run build",
    "backend:dev": "backend\\.venv\\Scripts\\python.exe backend\\manage.py runserver 8000",
    "backend:migrate": "backend\\.venv\\Scripts\\python.exe backend\\manage.py migrate"
  }
}
```
This enables running commands like `npm run frontend:dev` or `npm run backend:dev` from the repository root.
