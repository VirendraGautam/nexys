# Deploying Nexus Store to Netlify

This guide explains how to deploy the **Nexus Store** web application to **Netlify** without any build or publishing errors.

---

## 🛠️ Root Causes of Netlify Failures & How They Were Fixed

If your deployment previously failed on Netlify, it was due to one of three common issues (now completely resolved):

1. **`npm install` Peer Dependency Conflict (`ERESOLVE`)**:
   - **Fix**: Removed the conflicting `esbuild@^0.25.0` pin, added `.npmrc` with `legacy-peer-deps=true`, added `NPM_FLAGS = "--legacy-peer-deps"` in `netlify.toml`, and generated a clean `package-lock.json`.
2. **ESM `__dirname` ReferenceError in `vite.config.ts`**:
   - **Fix**: Replaced Node CommonJS `__dirname` with standard ESM `fileURLToPath(new URL('.', import.meta.url))` to ensure compatibility with Node 20/22 on Netlify.
3. **Netlify Drop Missing Root `index.html`**:
   - **Fix**: Repackaged `nexus-store-dist.zip` so `index.html`, `_redirects`, and `assets/` are located at the **archive root**, allowing Netlify Drop to recognize the site immediately.

---

## 🚀 Option 1: Instant Drag & Drop via Netlify Drop (Fastest, No Git Required)

1. Download the updated **[`nexus-store-dist.zip`](/nexus-store-dist.zip)** archive.
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
3. Drag and drop the `nexus-store-dist.zip` file directly into the drop zone (or extract it and drag the folder).
4. Netlify will deploy it in seconds and generate your live URL!

---

## 🌐 Option 2: Deploy from GitHub / GitLab / Bitbucket

If you prefer continuous deployment from Git:

### Step 1: Push Code to Git
Push your project files (including `package-lock.json`, `.npmrc`, and `netlify.toml`).

### Step 2: Import into Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select your repository.

### Step 3: Deployment Settings (Auto-Detected)
Netlify will auto-detect `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node Version**: `20`
- **NPM Flags**: `--legacy-peer-deps`

Click **"Deploy Nexus Store"**.

---

## ⚙️ Netlify Features Enabled
- **SPA Routing**: `public/_redirects` and `netlify.toml` route all requests to `/index.html` with status 200.
- **Client Fallback Engine**: If the backend is hosted statically, `src/services/nexusService.ts` provides persistent local storage for real-time stock counters, order tracking, and payment simulation.
- **Security Headers**: Enforced via `netlify.toml`.
