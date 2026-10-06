# Deploying Nexus Store to Netlify

This guide details how to deploy the **Nexus Store** web application to **Netlify** with zero configuration required.

---

## ⚡ Quick Deployment (Recommended: GitHub / Git)

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Push your project repository to your Git provider of choice.

### Step 2: Connect Repository in Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select your repository.

### Step 3: Verify Build Settings
The repository includes a pre-configured `netlify.toml` file, so Netlify will auto-detect these settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20` (specified in `netlify.toml`)

Click **"Deploy Nexus Store"**. Your site will build in ~30 seconds and receive a live URL (`https://your-site-name.netlify.app`).

---

## 🚀 Alternative: Deploy via Netlify CLI

If you prefer deploying from your terminal:

```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

## 📂 Alternative: Drag & Drop Manual Deploy

1. Run `npm run build` locally in your terminal.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist/` folder into the drop zone.

---

## 🛡️ Netlify Features Configured

1. **SPA Routing Support (`public/_redirects` & `netlify.toml`)**:
   All deep routes and refreshes automatically resolve to `/index.html` with HTTP 200 to prevent 404 errors.

2. **Full-Journey Simulation on Netlify CDN**:
   - Real-time inventory tracking and synchronization.
   - Low-stock badges and out-of-stock validation.
   - Dummy payment gateway with test card simulations (`4242...` for approval, `0002` for decline).
   - Live order tracking and interactive delivery milestone advancement.
   - Transactional email confirmation viewer.
   - `localStorage` persistence across page reloads.

3. **Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
