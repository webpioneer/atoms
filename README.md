# Atoms — an Atomic Habits tracker (PWA)

A habit, goal and progress tracker built on the ideas in *Atomic Habits*. Plain HTML/CSS/JS with no build step. It works offline, and all data stays on your device in `localStorage`.

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
| 1st law: make it obvious | Implementation intention (time + location) and a habit stack ("After I …") |
| 2nd law: make it attractive | Temptation-bundling field |
| 3rd law: make it easy | Two-minute version and an environment-priming field |
| 4th law: make it satisfying | Immediate reward field, the check animation, streaks, a heatmap you can't stop filling in |
| Breaking bad habits | A "Break" habit type uses the inverted laws: invisible, unattractive, difficult, unsatisfying |
| Never miss twice | Today shows a warning when you missed the previous scheduled day |
| Habit Scorecard | More → Habit Scorecard: list your day and rate each item + / = / − |
| Systems over goals | Goals have milestones and linked habits ("the system") with 30-day consistency |
| 1% better | Progress → The power of 1% |

You can also write a daily reflection, go back to past days to fill in what you missed, archive habits, and export/import a JSON backup (More → Your data).

## Updating

When you change any file, bump `CACHE` in `sw.js` (e.g. `atoms-v2`) so installed copies pick up the new version.
