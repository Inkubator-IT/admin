## Inkubator IT — Vite + React Template

Standardized frontend template for projects in the Inkubator IT GitHub organization. This template is built and maintained by the DevOps team to unify stack choices, local development, containerization, and deployment conventions across client projects.

### Tech stack
- **Runtime**: Bun (scripts, tooling)
- **Build tool**: Vite
- **Framework**: React
- **Language**: TypeScript
- **UI**: Tailwind CSS v4
- **Icons**: lucide-react
- **Quality**: Biome (lint & format)
- **Containerization**: Docker (Nginx static serving)

### Project structure
```
.
├─ src/
│  ├─ assets/            # Static assets (e.g., logos)
│  ├─ lib/               # Shared utilities
│  ├─ App.tsx            # Root component
│  ├─ index.css          # Global styles (Tailwind v4)
│  ├─ main.tsx           # App bootstrap
│  └─ vite-env.d.ts      # Vite type declarations
├─ public/               # Public assets copied as-is
│  └─ vite.svg
├─ index.html            # HTML entry
├─ vite.config.ts        # Vite config (alias `@` → `src`)
├─ Dockerfile            # Multi-stage (Bun build → Nginx serve)
├─ components.json       # UI components registry (if used)
├─ biome.json            # Biome config (lint/format)
├─ tsconfig.json         # TypeScript config
├─ tsconfig.app.json     # TS project references (app)
├─ tsconfig.node.json    # TS project references (node build)
├─ package.json          # Scripts and deps
└─ bun.lock              # Bun lockfile
```

### Prerequisites
- **Bun** installed locally (`bun --version`)
- **Docker** (optional, for container builds)

### Getting started (local development)
1) Create a new repository using this template in the Inkubator IT organization.
2) Clone your new repository.
3) Copy the `.env.example` file to `.env` and fill in the values.
4) Install dependencies:
```sh
bun install
```
5) Start the dev server (hot reload):
```sh
bun run dev
```
6) Open `http://localhost:5173` (default Vite port).

### Environment variables
Vite reads env files and exposes variables that start with `VITE_` to the client.

- Place env files at the project root: `.env`, `.env.development`, etc.
- Prefix variables with `VITE_`.

Example `.env`:
```env
VITE_API_BASE_URL="http://localhost:3000"
```

Use in code:
```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
```

### Scripts
- **dev**: `vite`
- **build**: `tsc -b && vite build`
- **preview**: `vite preview`
- **lint**: `bunx biome lint`
- **lint:fix**: `bunx biome lint --write`
- **format**: `bunx biome format --write`

Run examples:
```sh
bun run dev
bun run build
bun run preview
```

### Aliases
This template sets an import alias for cleaner paths:

- **Alias**: `@` → `./src` (see `vite.config.ts`)

Example:
```ts
import { cn } from "@/lib/utils";
```

### Styling
- Tailwind CSS v4 is preconfigured via `@import "tailwindcss"` in `src/index.css`.
- Light/dark theme tokens are included. Apply `.dark` on a parent node to switch.

### Run with Docker
Build a production image (static site served by Nginx):
```sh
docker build -t inkubatorit/vite-react-template .
```
Run the container:
```sh
docker run --rm -p 8080:80 inkubatorit/vite-react-template
```
Open `http://localhost:8080`.

### Code quality
This template uses Biome for linting and formatting. Run locally before commits:
```sh
bun run lint
bun run format
```

### Deployment notes
- The production build outputs static files in `dist/`.
- The provided `Dockerfile` serves `dist/` with Nginx on port `80`.
- Vite env variables are injected at build time; ensure correct values during `build`.
- If hosting behind a sub-path, set Vite `base` accordingly in `vite.config.ts`.

### Contributing
This template is maintained by the **Inkubator IT DevOps** team. Contributions and improvements are welcome via Pull Requests. For significant changes, please open an Issue for discussion first.

### Support
For questions or support, contact the Inkubator IT DevOps team.

### License
Copyright (c) Inkubator IT. All rights reserved.


