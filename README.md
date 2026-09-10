# Velvet House

A play-money casino demo built with React + Vite. The main event is **Wild Switch**, an Uno-style card game played against a computer opponent — match colors and numbers, stack Skips, Draw Twos, and Wilds, and empty your hand first to win. Rock, Paper, Scissors and Dice & Coin round out the table. Everything runs on virtual credits stored in the browser — no real money, accounts, or payments involved.

Wild Switch uses original card art and its own name rather than "Uno" — the color/number/skip/reverse/draw mechanics aren't ownable, but the Uno name and card designs are Mattel's trademark, so this is inspired-by rather than a reproduction.

## Games

- **Wild Switch** — an Uno-style card game against a computer opponent. Pick a stake, get dealt seven cards, and empty your hand first to win double your stake back.
- **Rock, Paper, Scissors** — one quick call against the house. A win pays even money; a tie returns your bet.
- **Dice & Coin** — call a coin flip for even money, or call the exact face of a die for a 6× payout.

## Design

Dark luxury palette: near-black background, antique gold accents, a deep velvet red used sparingly as an accent color. Headings use Fraunces (serif, italic), UI and numbers use Manrope. Wild Switch's cards use solid color fields with serif labels rather than reproducing any existing card game's artwork.

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