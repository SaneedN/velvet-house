# Velvet House

A play-money casino demo built with React + Vite. Three games — Slots, Roulette, and Dice & Coin — all played with virtual credits stored in the browser. No real money, accounts, or payments are involved.

## Design

Dark luxury palette: near-black background, antique gold accents, a deep velvet red used sparingly for card-suit symbols and roulette reds. Headings use Fraunces (serif, italic), UI and numbers use Manrope. Card-suit glyphs stand in for slot icons instead of emoji, tying the visuals to the table-games theme.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the Vercel CLI).
2. Import the repo in Vercel — it auto-detects the Vite framework preset (build command `npm run build`, output directory `dist`, both also pinned in `vercel.json`).
3. Deploy. No environment variables are required.

## Notes

- Credits persist in `localStorage` on the visitor's device only; "Reset balance" sets it back to 1,000.
- This is a portfolio/demo project. It intentionally has no real-money payment integration — adding one would require gambling licensing that varies by jurisdiction and is outside this project's scope.
