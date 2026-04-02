'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Player } from './types'
import PlayerRoster from './components/PlayerRoster'
import TeamBuilder from './components/TeamBuilder'
import PositionStrategy from './components/PositionStrategy'
import StrategyTips from './components/StrategyTips'
import MatchSummary from './components/MatchSummary'

const TABS = ['Roster', 'Teams', 'Positions', 'Tips', 'Summary'] as const
type Tab = typeof TABS[number]

export default function Home() {
  const [tab, setTab] = useState<Tab>('Roster')
  const [players, setPlayers] = useState<Player[]>([])
  const [teamA, setTeamA] = useState<Player[]>([])
  const [teamB, setTeamB] = useState<Player[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage
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

  // Save to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('poloiq-state', JSON.stringify({ players, teamA, teamB }))
  }, [players, teamA, teamB, hydrated])

  const handlePlayersChange = (updated: Player[]) => {
    setPlayers(updated)
    // Remove deleted players from teams
    setTeamA(prev => prev.filter(p => updated.find(u => u.id === p.id)).map(p => updated.find(u => u.id === p.id)!))
    setTeamB(prev => prev.filter(p => updated.find(u => u.id === p.id)).map(p => updated.find(u => u.id === p.id)!))
  }

  const tabClass = (t: Tab) =>
    `px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
      tab === t
        ? 'bg-amber-500 text-slate-900'
        : 'text-slate-400 hover:text-white hover:bg-slate-700'
    }`

  if (!hydrated) return null

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-700/60 px-4 py-3 flex items-center gap-3">
        <Image src="/logo.svg" alt="PoloIQ logo" width={36} height={36} className="rounded-lg" />
        <div>
          <h1 className="font-black text-white text-lg leading-none">PoloIQ</h1>
          <p className="text-amber-400 text-xs font-medium">Build your best game</p>
        </div>
        <div className="ml-auto text-xs text-slate-500">{players.length} players</div>
      </header>

      {/* Tab nav */}
      <nav className="px-4 py-3 flex gap-1 border-b border-slate-700/40 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} className={tabClass(t)} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {tab === 'Roster' && (
          <PlayerRoster players={players} onChange={handlePlayersChange} />
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

        {/* Quick nav hint */}
        <p className="text-center text-xs text-slate-600 pb-4">
          {tab === 'Roster' && players.length >= 2 && '→ Head to Teams to build your match lineup'}
          {tab === 'Teams' && (teamA.length > 0 || teamB.length > 0) && '→ Check Positions for placement recommendations'}
          {tab === 'Positions' && '→ See Tips for tactical advice'}
          {tab === 'Tips' && '→ View Summary for a printable match card'}
        </p>
      </main>
    </div>
  )
}
