# Destination Alarm Prototype

This repository contains a browser-based prototype for a destination alarm.

## Features
- Enter destination latitude/longitude and an alarm radius.
- Use browser geolocation (`watchPosition`) for live distance updates.
- Trigger haptic + sound alert once when entering the destination radius.
- "Use current location" helper and manual alarm test button.

## Run locally
Because geolocation is permission-sensitive, run with a local server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Test
```bash
npm test
```

## Getting changes into GitHub from Codex
If you're using Codex and want the files to show up on GitHub, open the **PR** button in the top-right of the Codex window and create/merge the pull request. The files become visible in the repository on GitHub after that PR flow is completed.
