export const GAME_INSTRUCTIONS = {
  uno: {
    title: 'How to play Wild Switch',
    steps: [
      'Pick a stake and get dealt 7 cards.',
      'On your turn, play a card that matches the color or number showing, or play any Wild.',
      "Skip and Back cards take away the computer's next turn.",
      '+2 and +4 make the computer draw cards and lose its turn — Wild and +4 also let you choose the next color.',
      'No valid card? Draw one from the pile instead.',
      'Empty your hand first to win double your stake.',
    ],
  },
  rps: {
    title: 'How to play Rock, Paper, Scissors',
    steps: [
      'Pick a bet amount.',
      'Choose Rock, Paper, or Scissors.',
      'Rock beats Scissors, Scissors beats Paper, Paper beats Rock.',
      'A win pays double your bet; a tie returns it.',
    ],
  },
  dice: {
    title: 'How to play Dice & Coin',
    steps: [
      'Switch between Coin flip and Dice roll with the toggle.',
      'Coin flip: call heads or tails for an even-money payout.',
      'Dice roll: call the exact face (1–6) for a 6× payout.',
      'Pick your bet amount, then play.',
    ],
  },
}