# AI Resume Analyzer Interview Preparation Platform

## Recruiter demo

Use this shared account to try the live website:

- **Website:** <http://ec2-54-160-155-15.compute-1.amazonaws.com/login>
- **Email:** `recruiter.demo@resumeai.app`
- **Password:** `ResumeAI-Demo-2026!`

This is a public demo account. Please do not enter personal or sensitive information.

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

Copy `Backend/.env.example` to `Backend/.env` and fill in the values locally. Never commit `.env` files, private credentials, or secrets. The recruiter demo credentials above are intentionally public for the shared demo account.

The frontend reads `VITE_API_URL` at build time. It defaults to the EC2 site URL. In production, nginx serves the frontend and forwards `/api/*` requests to Express on port 8080.

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

The frontend is served at `http://localhost:5173` during local development. The deployed backend is available at `http://ec2-54-160-155-15.compute-1.amazonaws.com`.

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

The workflow is [`.github/workflows/CI-CD.yml`](.github/workflows/CI-CD.yml). It runs backend tests and the dependency audit, then builds the frontend on a GitHub-hosted Ubuntu runner. For pushes to `main`, it sends the build to the self-hosted EC2 runner for deployment. The EC2 runner is expected to run as a user with passwordless `sudo` for the deployment commands. The backend environment file must exist at `/home/ubuntu/app-config/backend.env`.

On deployment, the workflow installs the backend in `/home/ubuntu/app`, copies the frontend build to `/var/www/ai-resume-analyzer`, configures the nginx site from [`deploy/nginx.conf`](deploy/nginx.conf), and restarts the PM2 process named `backend`. Ensure the EC2 security group allows HTTP on port 80 and that nginx, Node.js 22, npm, PM2, and rsync are installed. The backend environment file stays outside the repository. The workflow does not deploy pushes to `develop`; those runs perform CI only.

## Repository safety

Generated files, dependencies, logs, uploads, local environment files, build output, and test reports are excluded by `.gitignore`. Before opening a pull request, review `git diff --cached` and confirm that no credentials or personal data are staged.
