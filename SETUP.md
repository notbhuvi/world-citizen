# Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Run locally on your Mac

```bash
npm run dev
```

Open `http://localhost:3000`. This is enough to develop and click through every screen, but **iOS Safari will not register the service worker or allow geolocation over plain HTTP from another device** — only `localhost` is exempt from that rule.

## 3. Test on your iPhone — LAN + HTTPS

Your Mac and iPhone must be on the **same Wi-Fi network**.

1. Find your Mac's LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. A self-signed certificate is already generated at `certificates/localhost.pem` (covers `localhost`, `127.0.0.1`, and the LAN IP it was generated for). If your IP changes, regenerate it:
   ```bash
   LAN_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
   openssl req -x509 -newkey rsa:2048 -keyout certificates/localhost-key.pem \
     -out certificates/localhost.pem -days 825 -nodes -subj "/CN=World Citizen Local" \
     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:$LAN_IP"
   ```
3. Start the HTTPS LAN server:
   ```bash
   npm run lan
   ```
4. On your iPhone, open Safari and go to `https://<your-mac-lan-ip>:3000`.
5. Safari will warn **"This Connection Is Not Private"** — this is expected for a self-signed cert. Tap **Show Details → visit this website → Visit Website**. You only need to do this once per session; the origin is still treated as a secure context, so the service worker and geolocation work normally afterward.
6. Allow location access when prompted, to personalize the dashboard.

## 4. Add to Home Screen

1. Tap the **Share** icon in Safari's toolbar.
2. Scroll down and tap **Add to Home Screen**.
3. Tap **Add**.
4. Launch World Citizen from your Home Screen — it opens full-screen, no Safari UI, with its own icon, exactly like a native app.

## 5. Verify offline support

1. With the app open and a few pages visited, turn on Airplane Mode.
2. Reopen the app from the Home Screen — the dashboard and any previously visited section should still render using cached data, with an "offline" banner.

## 6. Production build (optional, still local-only)

```bash
npm run build
npm run start:lan     # serves the optimized build on your LAN
```

## Notes on the self-signed certificate

- The private key (`certificates/localhost-key.pem`) never leaves your Mac and is excluded from version control via `.gitignore`.
- This is for **local testing only**. There is no public deployment — by design, per project scope.
