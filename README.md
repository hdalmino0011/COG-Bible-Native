# COG (T.J.R) Bible

An offline-first Bible application with parallel Cebuano (Bugna) and English
(KJV) text. It is built as a Progressive Web App for phones and desktop
browsers.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run lint
npm run build
```

The production files are written to `dist/`.

## Publish with GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` again, or run **Deploy to GitHub Pages** from the
   repository's **Actions** tab.

The included workflow builds and deploys the app. The Vite configuration uses
relative paths so it works at a GitHub Pages project URL, not only at a
domain root.

## Mobile App Builds (Android APK & iOS IPA)

This repository includes automated GitHub Actions workflows that automatically build both Android and iOS applications whenever you push code or trigger them manually from the **Actions** tab:

### 1. Android APK (`build-apk.yml`)
- Automatically builds `cog-tjr-bible-offline-debug.apk`.
- Located under **Actions → Build Android APK (Gradle) → Artifacts**.
- Download and install directly onto any Android phone.

### 2. iOS IPA (`build-ios.yml`)
- Automatically builds `cog-tjr-bible-offline.ipa` on a native macOS runner with Xcode.
- Located under **Actions → Build iOS IPA (Xcode) → Artifacts**.
- How to install on your iPhone or iPad:
  - **Sideloadly (Recommended / Easiest)**: Connect iPhone to Mac/PC, drag `cog-tjr-bible-offline.ipa` into [Sideloadly](https://sideloadly.io), enter your Apple ID, and click Start.
  - **AltStore**: Download the IPA directly to your iPhone and open it with [AltStore](https://altstore.io).
  - **TrollStore**: Direct installation on supported iOS versions without re-signing.
  - **Xcode**: Open Xcode → *Window → Devices and Simulators* → drag the IPA or app into *Installed Apps*.

### 3. iOS Safari Web App (Instant / No tools required)
- Open the deployed website in Safari on your iPhone.
- Tap the **Share** button (box with upward arrow).
- Select **Add to Home Screen**.
- The app installs as a standalone fullscreen app with full offline scripture caching and native feel.