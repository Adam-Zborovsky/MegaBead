# Phase 1 — Stack Modernization Implementation Plan

> **For agentic workers:** Use inline execution with checkpoints.

**Goal:** Migrate frontend from CRA to Vite 5 + TypeScript + Tailwind CSS + shadcn/ui, add TanStack Query, react-hook-form, zod, and proper axios interceptors. No visual changes.

**Architecture:** Vite handles bundling and dev server. TypeScript in strict mode catches bugs. Tailwind coexists with Bootstrap temporarily. shadcn/ui components live in `src/components/ui/`. TanStack Query wraps data fetching. A single axios instance in `services/http.ts` handles auth and 401s.

**Tech Stack:** Vite 5, TypeScript 5, React 19, Tailwind CSS 3.4, shadcn/ui, TanStack Query 5, react-hook-form, zod, ESLint flat config, Prettier, Husky.

---

### Task 1: Bootstrap Vite project config

**Files:**
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/index.html`
- Modify: `frontend/package.json`
- Delete: `frontend/public/index.html`

- [ ] **Step 1: Write vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 3: Write tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Write tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Write root index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Custom jewelry design platform with interactive bead builder and e-commerce features." />
    <link rel="apple-touch-icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    <title>Mega Bead</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Update package.json**

Replace scripts and dependencies:

```json
{
  "name": "megabead-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css}\""
  },
  "dependencies": {
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.9.0",
    "bootstrap": "^5.3.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.4.10",
    "gsap": "^3.12.7",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.460.0",
    "react": "^19.0.0",
    "react-bootstrap": "^2.10.9",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.0",
    "react-router-dom": "^7.5.3",
    "react-toastify": "^11.0.5",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitejs/plugin-react": "^4.4.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0",
    "postcss": "^8.4.47",
    "prettier": "^3.4.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

Remove old `frontend/package-lock.json` and run `npm install`.

---

### Task 2: Rename entry point and update env

**Files:**
- Rename: `frontend/src/index.js` → `frontend/src/index.tsx`
- Modify: `frontend/src/index.tsx`
- Modify: `/.env`
- Modify: all files using `process.env.REACT_APP_API_URL`

- [ ] **Step 1: Rename index.js to index.tsx**

- [ ] **Step 2: Update index.tsx imports**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Update .env**

Change `REACT_APP_API_URL=/api` to `VITE_API_URL=/api`.

- [ ] **Step 4: Replace all process.env.REACT_APP_API_URL**

Search and replace across all frontend files:
- `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`

Files to touch: `services/*.js`, `pages/*.jsx`, `components/*.jsx`

---

### Task 3: Set up Tailwind CSS and shadcn/ui

**Files:**
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/src/lib/utils.ts`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Write tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F6F1E7',
        linen: '#EDE3D2',
        clay: '#3E2B23',
        terracotta: '#B8553A',
        moss: '#5B6E4F',
        ink: '#1A1612',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Write postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Write lib/utils.ts**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Update index.css**

Prepend Tailwind directives, keep Bootstrap variables for now:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
}
```

Keep existing Bootstrap CSS variable overrides after the Tailwind directives.

---

### Task 4: Create axios http.ts with interceptors

**Files:**
- Create: `frontend/src/services/http.ts`
- Modify: `frontend/src/services/userService.js`
- Modify: `frontend/src/services/productService.js`
- Modify: `frontend/src/services/cartService.js`

- [ ] **Step 1: Write http.ts**

```ts
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
```

- [ ] **Step 2: Refactor userService.js to use http.ts**

```ts
import http from './http';

const apiURL = '/users/';

export const registerUser = (user: object) => http.post(apiURL, user);
export const loginUser = (email: string, password: string) =>
  http.post(apiURL + 'login', { email, password });
export const getAllUsers = () => http.get(apiURL);
export const getUserById = (id: string) => http.get(apiURL + id);
export const updateUser = (id: string, data: object) => http.put(apiURL + id, data);
export const deleteUser = (id: string) => http.delete(apiURL + id);
export const updateUserProfile = (user: { _id: string }) =>
  http.put(apiURL + user._id, user);
export const deleteUserProfile = () => http.delete(apiURL + 'me');
```

- [ ] **Step 3: Refactor productService.js**

```ts
import http from './http';

const apiURL = '/products/';

export const getAllProducts = () => http.get(apiURL);
export const getProductById = (id: string) => http.get(apiURL + id);
export const createProduct = (data: FormData | object) =>
  http.post(apiURL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id: string, data: FormData | object) =>
  http.put(apiURL + id, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id: string) => http.delete(apiURL + id);
```

- [ ] **Step 4: Refactor cartService.js**

```ts
import http from './http';

const apiURL = '/cart/';

export const getCart = (id: string) => http.get(apiURL + id);
export const addToCart = (item: object) => http.post(apiURL, item);
export const removeFromCart = (userId: string, productId: string) =>
  http.delete(apiURL, { data: { userId, productId } });
export const addCustomProductToCart = (customProduct: object, quantity: number) =>
  http.post(apiURL, { customProduct, quantity });
```

---

### Task 5: Set up TanStack Query

**Files:**
- Create: `frontend/src/lib/queryClient.ts`
- Modify: `frontend/src/index.tsx`

- [ ] **Step 1: Write queryClient.ts**

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

- [ ] **Step 2: Wrap app in QueryClientProvider**

Update `index.tsx` to wrap `<App />` with `QueryClientProvider`.

---

### Task 6: Add shadcn/ui base components

**Files:**
- Create: `frontend/src/components/ui/button.tsx`
- Create: `frontend/src/components/ui/input.tsx`
- Create: `frontend/src/components/ui/label.tsx`
- Create: `frontend/src/components/ui/select.tsx`
- Create: `frontend/src/components/ui/card.tsx`
- Create: `frontend/src/components/ui/badge.tsx`
- Create: `frontend/src/components/ui/skeleton.tsx`
- Create: `frontend/src/components/ui/dialog.tsx`
- Create: `frontend/src/components/ui/tabs.tsx`
- Create: `frontend/src/components/ui/sheet.tsx`
- Create: `frontend/src/components/ui/dropdown-menu.tsx`
- Create: `frontend/src/components/ui/form.tsx`
- Create: `frontend/src/components/ui/toast.tsx`
- Create: `frontend/src/components/ui/toaster.tsx`

- [ ] **Step 1: Use shadcn CLI to init**

```bash
cd frontend && npx shadcn@latest init --yes --defaults
```

- [ ] **Step 2: Add components**

```bash
npx shadcn@latest add button input label select card badge skeleton dialog tabs sheet dropdown-menu form toast
```

---

### Task 7: ESLint + Prettier + Husky

**Files:**
- Create: `frontend/eslint.config.js`
- Create: `frontend/.prettierrc`
- Create: `frontend/.prettierignore`
- Modify: `frontend/package.json` (add husky/lint-staged config)

- [ ] **Step 1: Write eslint.config.js**

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

- [ ] **Step 2: Write .prettierrc**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": true,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- [ ] **Step 3: Add husky + lint-staged to package.json**

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}
```

Run `npx husky init` and add pre-commit hook.

---

### Task 8: Smoke test

**Files:**
- All

- [ ] **Step 1: Run dev server**

```bash
cd frontend && npm run dev
```

Verify pages load without errors.

- [ ] **Step 2: Run typecheck**

```bash
cd frontend && npx tsc --noEmit
```

Fix any type errors. Builder files (.jsx) may be excluded from tsconfig include.

- [ ] **Step 3: Run build**

```bash
cd frontend && npm run build
```

Verify no build errors.

---

## Self-Review

1. **Spec coverage:** All Phase 1 items from REDESIGN_PLAN.md are covered: Vite/TS (Task 1-2), Tailwind/shadcn (Task 3, 6), TanStack Query (Task 5), react-hook-form/zod (installed in Task 1, used in Phase 3), Axios interceptor (Task 4), ESLint/Prettier/Husky (Task 7).
2. **Placeholder scan:** No TBDs, all code shown.
3. **Type consistency:** `import.meta.env.VITE_API_URL` used consistently. http.ts exports default axios instance. Services use `http.` methods.
