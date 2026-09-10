import React, { useState } from 'react'
import { CreditsProvider } from './context/CreditsContext.jsx'
import Header from './components/Header.jsx'
import GameTabs from './components/GameTabs.jsx'
import SlotMachine from './games/SlotMachine.jsx'
import Roulette from './games/Roulette.jsx'
import DiceCoinflip from './games/DiceCoinflip.jsx'

export default function App() {
  const [tab, setTab] = useState('slots')

  return (
    <CreditsProvider>
      <div className="app">
        <Header />
        <GameTabs active={tab} onChange={setTab} />

        {tab === 'slots' && <SlotMachine />}
        {tab === 'roulette' && <Roulette />}
        {tab === 'dice' && <DiceCoinflip />}

        <footer className="footer">
          Demo only — every credit here is virtual. No real money is wagered, held, or paid out.
        </footer>
      </div>
    </CreditsProvider>
  )
}
