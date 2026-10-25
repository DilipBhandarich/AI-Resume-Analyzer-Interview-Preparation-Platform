# AI Resume Analyzer Interview Preparation Platform

A full-stack application that compares a candidate's resume with a target job description and generates a tailored interview-preparation plan.

## Stack

- Frontend: React 19, Vite, Sass, React Router
- Backend: Node.js 22+, Express 5, Mongoose, Google Gemini API
- Database: MongoDB
- Package manager: npm, with committed lockfiles in both application folders

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer
- MongoDB connection string
- Google GenAI API key for report generation

## Configuration

Copy `Backend/.env.example` to `Backend/.env` and fill in the values locally. Never commit `.env` files or real credentials.

The frontend reads `VITE_API_URL` at build time. It defaults to `http://localhost:3000`.

## Local development

Install dependencies:

```bash
cd Backend && npm ci
cd ../Frontend && npm ci
```

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the Vite frontend in another terminal:

```bash
cd Frontend
npm run dev
```

The frontend is served at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Validation

Run backend tests:

```bash
cd Backend
npm test
```

Build the frontend:

```bash
cd Frontend
npm run build
```

There is currently no lint or formatting script configured. The GitHub Actions workflow runs the backend tests, a high-severity dependency audit, and the frontend production build on pushes to `main`/`develop` and pull requests targeting `main`.

## CI/CD

The workflow is [`.github/workflows/CI-CD.yml`](.github/workflows/CI-CD.yml). It uses GitHub-hosted runners, Node.js 22, `npm ci`, lockfile-aware caching, backend tests, `npm audit --audit-level=high`, and the frontend production build. Pull requests do not receive production secrets.

No deployment platform is currently configured or identifiable in this repository, so production deployment is intentionally not enabled. To add CD, choose a hosting target for the frontend and backend, then add its deployment action and credentials as GitHub Environment secrets. The required application settings are documented in `Backend/.env.example` and should be configured in the hosting platform rather than committed.

## Repository safety

Generated files, dependencies, logs, uploads, local environment files, build output, and test reports are excluded by `.gitignore`. Before opening a pull request, review `git diff --cached` and confirm that no credentials or personal data are staged.
