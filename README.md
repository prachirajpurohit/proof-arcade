# Proof / 7 Days

A lightweight, mobile-friendly, no-backend learning adventure for the Proof cohort. Day 1 (Blackout Protocol) is playable; Days 2–7 are visible as coming-soon mission cards.

## Start locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Select the **Vite** framework preset if Vercel does not detect it.
4. Build command: `npm run build`; output directory: `dist`.
5. Deploy and share the generated URL.

## How it works

- Name entry (only used to personalize the site).
- Seven-day mission selection; Day 1 is playable, others are coming soon.
- Day 1 has briefing, investigation (click buildings), energy-allocation planning, a comparison of restoration outcomes, and a problem decomposition exercise.
- Optional hints, replayable strategies, a Day 1 flag card, and a copyable Proof log.
- `localStorage` saves only the entered name and a Day 1 completion flag on the same browser. **No answers, marks, accounts, or leaderboard are saved or transmitted.**
- Day 1's attempts and answers remain only in the page's memory until refreshed or replayed.

## Customize

- Edit `days` and `services` in `src/main.jsx` to update content.
- Add Day 2+ screens by extending the mission selection and stage logic.
- The illustrated city is an inline SVG in `City`, so it requires no external image assets.
- Fonts are loaded from Google Fonts; if offline, system font fallbacks will be used.

## Facilitator suggestion (30–45 minutes)

- Briefing and investigation (8–10 min).
- Make a plan and try a different strategy (10–12 min). Ask students to explain one service they restored and one they left offline.
- Break down the college food delivery problem (8–10 min). For discussion, one possible split is finding food and placing an order, confirming and preparing it, and handing it off to the student. Ask which problems depend on one another.
- Ask students to use **Copy my log** or screenshot their flag card to share their work (4–8 min).

## Notes

This is a prototype, not a production-reviewed accessibility or security release. The city graphic includes keyboard-operable building targets. The browser's local storage can be cleared or disabled by the student, and completion does not sync between devices.
