import React, { useState } from 'react'
import { CreditsProvider } from './context/CreditsContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import GameGrid from './components/GameGrid.jsx'
import DiceCoinflip from './games/DiceCoinflip.jsx'
import RockPaperScissors from './games/RockPaperScissors.jsx'
import WildSwitch from './games/WildSwitch.jsx'

const GAMES = [
  {
    id: 'uno',
    title: 'Wild Switch',
    tag: 'Uno-style card game',
    icon: '🃏',
    gradient: 'linear-gradient(135deg, #ff6a3d, #ff3d77)',
    Component: WildSwitch,
  },
  {
    id: 'rps',
    title: 'Rock, Paper, Scissors',
    tag: 'One quick call',
    icon: '✊',
    gradient: 'linear-gradient(135deg, #7b5cff, #b06cff)',
    Component: RockPaperScissors,
  },
  {
    id: 'dice',
    title: 'Dice & Coin',
    tag: 'Classic even-money bets',
    icon: '🎲',
    gradient: 'linear-gradient(135deg, #2e8bff, #3dd0ff)',
    Component: DiceCoinflip,
  },
]

export default function App() {
  const [activeId, setActiveId] = useState('uno')
  const activeGame = GAMES.find((g) => g.id === activeId)
  const ActiveComponent = activeGame?.Component

  return (
    <CreditsProvider>
      <div className="dashboard-shell">
        <Sidebar />

        <div className="dashboard-main">
          <TopBar name="Saneed" />

          <div className="dashboard-body">
            <div className="dashboard-left">
              <GameGrid games={GAMES} activeId={activeId} onSelect={setActiveId} />

              <footer className="footer">
                Demo only — every credit here is virtual. No real money is wagered, held, or paid out.
              </footer>
            </div>

            <div className="detail-panel">
              {ActiveComponent ? <ActiveComponent /> : (
                <div className="detail-empty">Pick a game to get started.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CreditsProvider>
  )
}