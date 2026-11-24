# Atoms — an Atomic Habits tracker (PWA)

A habit, goal and progress tracker built on the ideas in *Atomic Habits*, in English and French (it follows the phone's language; switch under More → Language). Plain HTML/CSS/JS with no build step. It works offline, and all data stays on your device in `localStorage`.

## Run locally

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

The service worker needs `http://localhost` or HTTPS. Opening the file directly with `file://` disables offline mode.

## Deploy / install on your phone

Upload the folder to any static host that serves HTTPS, such as Netlify Drop, Vercel, GitHub Pages or Cloudflare Pages. Then open it on your phone:
- **iPhone:** Safari → Share → *Add to Home Screen*
- **Android:** Chrome → menu → *Install app*

## What's inside

| Book idea | Where it lives |
|---|---|
| Identity-based habits | Each habit has an "I am …" identity. Every check-in counts as a *vote* for it (see Progress → Identity votes). |
| 1st law: make it obvious | Implementation intention (start time, duration and location) and a habit stack ("After I …") |
| 2nd law: make it attractive | Temptation-bundling field |
| 3rd law: make it easy | Two-minute version and an environment-priming field |
| 4th law: make it satisfying | Immediate reward field, the check animation, streaks, a heatmap you can't stop filling in |
| Breaking bad habits | A "Break" habit type uses the inverted laws: invisible, unattractive, difficult, unsatisfying |
| Never miss twice | Today shows a warning when you missed the previous scheduled day |
| Habit Scorecard | More → Habit Scorecard: list your day and rate each item + / = / − |
| Systems over goals | Goals have milestones and linked habits ("the system") with 30-day consistency |
| 1% better | Progress → The power of 1% |

| Two-minute rule, in practice | Habits with a duration get a ▶ timer on Today. Run the full session or "just 2 minutes"; it checks the habit off when time is up |

## Daily plan (drag and drop)

Every row on **Today** has a ⠿ handle. Drag it to put the day in the order you'll actually do things; habits and prayers mix freely. The order is saved as that day's plan and carries over to the following days until you change it, so you set up your routine once and adjust it when a day is different. **Reset order** goes back to the default (anytime habits first, then everything else by time). New habits slot in next to the item they'd follow by default.

On the **Habits** tab, the same handle reorders your habit list. That order is also the default order for anytime habits on Today. On a keyboard, focus a handle and use ↑/↓.

## Prayer times

Turn this on under **More → Prayer times**. The five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) then appear on Today as 15-minute blocks, in time order alongside your habits, and you can check them off. Progress shows the last 14 days.

- Times are calculated on the device with [Adhan](https://github.com/batoulapps/adhan-js) (bundled in `vendor/`, MIT) from the phone's location. Your location is never sent anywhere.
- Your location refreshes automatically when you open the app (if location access is allowed) or change time zone, so the times follow you when you travel. You can also enter coordinates manually.
- The calculation method defaults to the one for your time zone (e.g. France → UOIF 12°, Morocco → 19°/17°, Saudi Arabia → Umm al-Qura; Muslim World League otherwise). You can change it, choose the Hanafi Asr, and shift any prayer by ±30 minutes to match your mosque.

## Logbook (workouts, reading, writing, progress photos)

Any habit can log details each day, not just a check — set it under **Tracking** when creating/editing a habit, or tap the 📖 button on a habit on Today:

- **Reading** — book, page, language, a note, and photos.
- **Writing** — a link (to your doc/post), title, word count, note, photos.
- **Workout** — pick the session (Push/Pull/Legs); it shows your program's exercises with target sets×reps and your last weights, and you log actual weight × reps per set.
- **Progress photos** — a photo + note; the habit's page shows a scrollable photo timeline.
- **Note** — a free note + photos on any habit.

Photos are stored **on your device** (IndexedDB) and never uploaded. They're bundled into **Export backup** (and restored on import), so keep backups if the photos matter to you — clearing the browser's data for the site erases them.

Workout programs live on the habit (`program`), so the session logger always shows the right exercises.

## On-device AI coach

The **Coach** tab and the **Fill with AI** button (new-habit form) use a small language model that runs entirely in the browser through WebGPU, with [WebLLM](https://github.com/mlc-ai/web-llm) (bundled in `vendor/`, Apache-2.0) and **Qwen2.5 1.5B Instruct** (Apache-2.0).

- **Private:** prompts and answers never leave the device. Only the model files are downloaded, from Hugging Face and GitHub, on first use.
- **One-time download, about 880 MB.** WebLLM caches it in the browser (Cache Storage), and the app's service worker leaves those caches alone when the app updates. It can be removed under More → Coach.
- **Requirements:** a browser with WebGPU. On iPhone that means iOS 26 or later in Safari; on Android, a recent Chrome. It works best on recent phones. Answers take about 15–30 seconds.
- **Limits:** it's a small model. Treat its suggestions as a starting point and edit them. A smaller 0.5B model was tested and dropped because its suggestions were off-topic.

You can also write a daily reflection, go back to past days to fill in what you missed, archive habits, and export/import a JSON backup (More → Your data).

## Updating

When you change any file, bump `CACHE` in `sw.js` (e.g. `atoms-v2`) so installed copies pick up the new version.
