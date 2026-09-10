import React, { useState } from 'react'
import { CreditsProvider } from './context/CreditsContext.jsx'
import Header from './components/Header.jsx'
import GameTabs from './components/GameTabs.jsx'
import DiceCoinflip from './games/DiceCoinflip.jsx'
import RockPaperScissors from './games/RockPaperScissors.jsx'
import WildSwitch from './games/WildSwitch.jsx'

export default function App() {
  const [tab, setTab] = useState('dice')

  return (
    <CreditsProvider>
      <div className="app">
        <Header />
        <GameTabs active={tab} onChange={setTab} />

        {tab === 'dice' && <DiceCoinflip />}
        {tab === 'rps' && <RockPaperScissors />}
        {tab === 'uno' && <WildSwitch />}

        <footer className="footer">
          Demo only — every credit here is virtual. No real money is wagered, held, or paid out.
        </footer>
      </div>
    </CreditsProvider>
  )
}