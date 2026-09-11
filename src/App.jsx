import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CreditsProvider } from './context/CreditsContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import { ReviewsProvider } from './context/ReviewsContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import GameGrid from './components/GameGrid.jsx'
import DiceCoinflip from './games/DiceCoinflip.jsx'
import RockPaperScissors from './games/RockPaperScissors.jsx'
import WildSwitch from './games/WildSwitch.jsx'
import { GAME_INSTRUCTIONS } from './games/gameInstructions.js'
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

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

function Dashboard() {
  const [view, setView] = useState('home')
  const [activeId, setActiveId] = useState('uno')
  const activeGame = GAMES.find((g) => g.id === activeId)
  const ActiveComponent = activeGame?.Component
  const instructions = GAME_INSTRUCTIONS[activeId]

  return (
    <div className="dashboard-shell">
      <Sidebar active={view} onNavigate={setView} />

      <div className="dashboard-main">
        <TopBar />

        {view === 'home' && (
          <div className="dashboard-body">
            <div className="dashboard-left">
              <GameGrid games={GAMES} activeId={activeId} onSelect={setActiveId} />

              <footer className="footer">
                Demo only — every credit here is virtual. No real money is wagered, held, or paid out.
              </footer>
            </div>

            <div className="detail-panel">
              {ActiveComponent ? <ActiveComponent /> : <div className="detail-empty">Pick a game to get started.</div>}

              {instructions && (
                <div className="instructions-block">
                  <h3>{instructions.title}</h3>
                  <ol>
                    {instructions.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'saved' && (
          <div className="single-column">
            <SavedPage />
          </div>
        )}

        {view === 'reviews' && (
          <div className="single-column">
            <ReviewsPage />
          </div>
        )}

        {view === 'profile' && (
          <div className="single-column">
            <ProfilePage />
          </div>
        )}
      </div>
    </div>
  )
}

function Gate() {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (!user) return <AuthPage />
  return (
    <CreditsProvider>
      <HistoryProvider>
        <Dashboard />
      </HistoryProvider>
    </CreditsProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ReviewsProvider>
        <Gate />
      </ReviewsProvider>
    </AuthProvider>
  )
}