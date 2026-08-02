# 🚂 Train Snake

Snake, but with **trains**. One or two players share a board and grow their train
by grabbing cargo (one car per pickup). Hit a wall, yourself, or the other train
and it's **Game Over** — a screen shows the score and you tap **Restart**.

It's a single self-contained HTML file (canvas + vanilla JS, zero dependencies),
and it installs as a home-screen app (PWA) that works offline.

## Play

```bash
# just open it — no server needed
open index.html            # macOS  (or double-click the file)

# …or serve it (needed for phones on your network + PWA install)
node server.js             # → http://localhost:8099
node server.js 3000        # custom port
```

The server prints your machine's LAN address(es) so other devices on the same
Wi-Fi can join at `http://<that-ip>:<port>`.

## Controls

| | Keyboard | Touch |
|---|---|---|
| **Player 1** | Arrow keys | swipe the board, or the on-screen D-pad |
| **Player 2** | `W` `A` `S` `D` | the second D-pad |

Tap the **⚙️ gear** (top-left) to open Settings (this pauses the game):

- **Players** — `1P` (solo, default) or `2P`.
- **Speed** — 🐢 slow / 🚂 medium / 🐇 fast. Pick 🐢 for little kids.
- **Cargo 🟨** — how many pickups are on the board at once, `1`–`10`. With more than
  one, players can race to different cargo — great in 2P, fun in 1P too.
- **Train colour** — pick each train's colour from 8 swatches (Red, Orange, Yellow,
  Green, Teal, Blue, Purple, Pink). The score and D-pad recolour to match.
- **🎵 Music** — a built-in chiptune **medley** (Web Audio, no files): three songs in
  different keys/tempos that roll from one into the next (~52s before it repeats).
  Cargo pickups also chime. Off by default; tap once to start (browsers require a
  user tap before audio can play).

## Install as an app (PWA)

Serve the game over **HTTPS** (required for install/offline off-localhost — a tunnel
like [Tailscale](https://tailscale.com/) `serve`, Cloudflare Tunnel, or ngrok works),
open that URL on the phone, then:

- **iPhone — use Safari:** Share → *Add to Home Screen*. (Safari makes a true
  full-screen standalone app; Chrome's version on iOS is a weaker web-clip.)
- **Android Chrome:** menu → *Install app* / *Add to Home screen*.

Installed, it also works offline — a service worker caches the game shell.

## Phone / touch notes

- **Portrait and landscape both work.** Portrait puts the D-pads at the bottom (the
  single pad is centred in 1P); landscape moves them to the left/right edges. The
  board is sized to the space left over, so it never sits under the pads.
- **Haptics.** D-pad taps buzz (bigger on cargo, a rumble on a crash) on
  **Android/Chrome** via the Vibration API. **iOS has no Vibration API**; the game
  tries the iOS 17.4+ `<input switch>` haptic trick, but Apple only fires it in a real
  **Safari tab**, not in an installed standalone PWA — so on iPhone haptics are
  effectively unavailable in the home-screen app. (Real in-app haptics would need a
  native wrapper such as Capacitor's Haptics plugin.)

## Run it as a persistent service (optional)

Any process manager works. On macOS, a launchd LaunchAgent keeps it running across
reboots. Create `~/Library/LaunchAgents/com.<you>.trainsnake.plist` pointing at:

```
/path/to/node  /path/to/train-snake/server.js  8099
```

with `RunAtLoad` + `KeepAlive` set to `true`, then
`launchctl bootstrap gui/$(id -u) <plist>`. To reach it from anywhere, front it with
an HTTPS tunnel (e.g. `tailscale serve --bg 8099`), which also satisfies the PWA's
HTTPS requirement.

## Files

- `index.html` — the whole game (canvas + vanilla JS, self-contained)
- `server.js` — zero-dependency static server that serves the PWA assets
- `manifest.webmanifest`, `sw.js`, `icon-*.png`, `apple-touch-icon.png` — PWA bits

### Updating

Edit `index.html` and reload. The service worker is **network-first for HTML**, so an
online reload always pulls the latest version. If you change cached assets
(icons/manifest/`sw.js`), bump `CACHE` in `sw.js` so clients refresh.

## License

MIT — see [LICENSE](LICENSE).
