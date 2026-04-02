'use client'
import { useState, useEffect } from 'react'
import { Player } from './types'
import PlayerRoster from './components/PlayerRoster'
import TeamBuilder from './components/TeamBuilder'
import PositionStrategy from './components/PositionStrategy'
import StrategyTips from './components/StrategyTips'
import MatchSummary from './components/MatchSummary'

const TABS = ['Roster', 'Teams', 'Positions', 'Tips', 'Summary'] as const
type Tab = typeof TABS[number]

const DEMO_PLAYERS: Player[] = [
  { id: 'demo-1', name: 'James Stirling', handicap: 8 },
  { id: 'demo-2', name: 'Nicolás Pieres', handicap: 7 },
  { id: 'demo-3', name: 'Tom Morley', handicap: 5 },
  { id: 'demo-4', name: 'Alejandro Novillo', handicap: 6 },
  { id: 'demo-5', name: 'Ben Vestey', handicap: 4 },
  { id: 'demo-6', name: 'Sam Browne', handicap: 3 },
  { id: 'demo-7', name: 'Charlie Wright', handicap: 2 },
  { id: 'demo-8', name: 'Luke Davies', handicap: 1 },
]

export default function Home() {
  const [tab, setTab] = useState<Tab>('Roster')
  const [players, setPlayers] = useState<Player[]>([])
  const [teamA, setTeamA] = useState<Player[]>([])
  const [teamB, setTeamB] = useState<Player[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('poloiq-state')
      if (saved) {
        const { players: p, teamA: a, teamB: b } = JSON.parse(saved)
        if (p) setPlayers(p)
        if (a) setTeamA(a)
        if (b) setTeamB(b)
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('poloiq-state', JSON.stringify({ players, teamA, teamB }))
  }, [players, teamA, teamB, hydrated])

  const handlePlayersChange = (updated: Player[]) => {
    setPlayers(updated)
    setTeamA(prev => prev.filter(p => updated.find(u => u.id === p.id)).map(p => updated.find(u => u.id === p.id)!))
    setTeamB(prev => prev.filter(p => updated.find(u => u.id === p.id)).map(p => updated.find(u => u.id === p.id)!))
  }

  const loadDemoData = () => {
    setPlayers(DEMO_PLAYERS)
    const sorted = [...DEMO_PLAYERS].sort((a, b) => b.handicap - a.handicap)
    const a: Player[] = []
    const b: Player[] = []
    sorted.forEach((p, i) => (i % 2 === 0 ? a : b).push(p))
    setTeamA(a)
    setTeamB(b)
  }

  const tabIcons: Record<Tab, string> = {
    Roster: '👥',
    Teams: '⚡',
    Positions: '🎯',
    Tips: '💡',
    Summary: '📋',
  }

  if (!hydrated) return null

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #07111f 0%, #0a1628 40%, #0d1d35 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0c1a30dd 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)' }}>
          <span className="text-slate-900 text-lg">🏇</span>
        </div>
        <div>
          <h1 className="font-black text-white text-lg leading-none tracking-tight">PoloIQ</h1>
          <p className="text-amber-400/80 text-xs font-medium">Build your best game</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {players.length > 0 && (
            <span className="text-xs text-slate-500 bg-slate-700/50 px-2.5 py-1 rounded-full border border-slate-600/40">
              {players.length} players
            </span>
          )}
        </div>
      </header>

      {/* Tab nav */}
      <nav className="px-3 py-2.5 flex gap-1 border-b border-slate-700/30 overflow-x-auto"
        style={{ background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(8px)' }}>
        {TABS.map(t => (
          <button
            key={t}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              tab === t ? 'tab-active' : 'tab-inactive'
            }`}
            onClick={() => setTab(t)}
          >
            <span className="text-sm">{tabIcons[t]}</span>
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {tab === 'Roster' && (
          <PlayerRoster
            players={players}
            onChange={handlePlayersChange}
            onLoadDemo={loadDemoData}
          />
        )}
        {tab === 'Teams' && (
          <TeamBuilder
            players={players}
            teamA={teamA}
            teamB={teamB}
            onTeamsChange={(a, b) => { setTeamA(a); setTeamB(b) }}
          />
        )}
        {tab === 'Positions' && (
          <PositionStrategy teamA={teamA} teamB={teamB} />
        )}
        {tab === 'Tips' && (
          <StrategyTips teamA={teamA} teamB={teamB} />
        )}
        {tab === 'Summary' && (
          <MatchSummary teamA={teamA} teamB={teamB} />
        )}

        {/* Nav hint */}
        {tab === 'Roster' && players.length >= 2 && (
          <p className="text-center text-xs text-slate-600 pb-4">Tap <strong className="text-slate-500">Teams ⚡</strong> to build your lineup</p>
        )}
        {tab === 'Teams' && (teamA.length > 0 || teamB.length > 0) && (
          <p className="text-center text-xs text-slate-600 pb-4">Tap <strong className="text-slate-500">Positions 🎯</strong> for placement</p>
        )}
      </main>
    </div>
  )
}
