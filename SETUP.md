# Setup Guide

## Installing on your iPhone (the normal way)

1. Open Safari and go to **https://notbhuvi.github.io/moved-out/**
2. Allow location access when prompted, to personalize the dashboard.
3. Tap the **Share** icon in Safari's toolbar.
4. Scroll down and tap **Add to Home Screen** → **Add**.
5. Launch Moved Out from your Home Screen — it opens full-screen, no Safari UI, with its own icon.

This works over mobile data or any Wi-Fi. No computer needs to be running anything.

## Verify offline support

1. With the app open and a few pages visited, turn on Airplane Mode.
2. Reopen the app from the Home Screen — the dashboard and any previously visited section should still render using cached data, with an "offline" banner.

## How updates reach your phone

Every push to `main` triggers `.github/workflows/deploy.yml`, which rebuilds and redeploys to GitHub Pages automatically. The installed PWA's service worker checks for an updated app shell on each load; force-quit and reopen the app (or pull-to-refresh) to pick up a new version sooner.

---

## Local development (optional, for making changes)

```bash
npm install
npm run dev          # http://localhost:3000
```

This is enough to develop and click through every screen on your Mac, but iOS Safari will not register the service worker or allow geolocation over plain HTTP from another device — only `localhost` is exempt from that rule. To test on your iPhone *before* pushing to GitHub Pages, use the LAN+HTTPS flow below.

### Testing unreleased changes on your iPhone via LAN

Your Mac and iPhone must be on the same Wi-Fi network.

1. Find your Mac's LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. A self-signed certificate is already generated at `certificates/localhost.pem`. If your IP changes, regenerate it:
   ```bash
   LAN_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
   openssl req -x509 -newkey rsa:2048 -keyout certificates/localhost-key.pem \
     -out certificates/localhost.pem -days 825 -nodes -subj "/CN=Moved Out Local" \
     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:$LAN_IP"
   ```
3. Start the HTTPS LAN server: `npm run lan`
4. On your iPhone, open `https://<your-mac-lan-ip>:3000` in Safari and accept the self-signed certificate warning once ("Show Details → visit this website").

Note: this LAN build does **not** use the `/moved-out` base path the production GitHub Pages build uses, so don't `Add to Home Screen` from the LAN URL — install from the real production URL above instead, to avoid having two different installed copies with different base paths.

### Deploying changes

```bash
git add -A
git commit -m "..."
git push
```

That's it — the GitHub Actions workflow rebuilds and republishes automatically.
