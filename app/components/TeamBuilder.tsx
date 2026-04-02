'use client'
import { useState } from 'react'
import { Users, ArrowLeftRight, ChevronRight } from 'lucide-react'
import { Player } from '../types'

interface Props {
  players: Player[]
  teamA: Player[]
  teamB: Player[]
  onTeamsChange: (a: Player[], b: Player[]) => void
}

export default function TeamBuilder({ players, teamA, teamB, onTeamsChange }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  const autoSplit = () => {
    const sorted = [...players].sort((a, b) => b.handicap - a.handicap)
    const a: Player[] = []
    const b: Player[] = []
    sorted.forEach((p, i) => (i % 2 === 0 ? a : b).push(p))
    onTeamsChange(a, b)
  }

  const moveToTeam = (player: Player, target: 'A' | 'B') => {
    const newA = teamA.filter(p => p.id !== player.id)
    const newB = teamB.filter(p => p.id !== player.id)
    if (target === 'A') newA.push(player)
    else newB.push(player)
    onTeamsChange(newA, newB)
  }

  const totalHcp = (team: Player[]) => team.reduce((s, p) => s + p.handicap, 0)
  const diff = Math.abs(totalHcp(teamA) - totalHcp(teamB))
  const lowerTeam = totalHcp(teamA) <= totalHcp(teamB) ? 'Team A' : 'Team B'

  const unassigned = players.filter(p => !teamA.find(x => x.id === p.id) && !teamB.find(x => x.id === p.id))

  const TeamColumn = ({ team, label, color }: { team: Player[], label: string, color: string }) => (
    <div className="flex-1">
      <div className={`text-sm font-bold mb-2 ${color}`}>
        {label} <span className="text-slate-400 font-normal">({totalHcp(team)} HCP)</span>
      </div>
      <div className="min-h-24 bg-slate-700/40 rounded-lg p-2 space-y-1">
        {team.length === 0 && <p className="text-slate-600 text-xs text-center py-4">Drop players here</p>}
        {team.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-slate-700 rounded px-2 py-1.5 text-xs">
            <span>{p.name} <span className="text-amber-400">+{p.handicap > 0 ? p.handicap : p.handicap}</span></span>
            <button
              className="text-slate-400 hover:text-amber-400"
              onClick={() => moveToTeam(p, label === 'Team A' ? 'B' : 'A')}
              title="Switch team"
            >
              <ArrowLeftRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <Users size={20} /> Team Builder
        </h2>
        <button className="btn-primary text-xs" onClick={autoSplit}>Auto-split</button>
      </div>

      {/* Unassigned players */}
      {unassigned.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2">Unassigned — click to assign:</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(p => (
              <div key={p.id} className="flex items-center gap-1 bg-slate-700 rounded-lg px-2 py-1 text-xs">
                <span>{p.name} <span className="text-amber-400">{p.handicap}</span></span>
                <button className="text-blue-400 hover:text-blue-300 ml-1" onClick={() => moveToTeam(p, 'A')}>→A</button>
                <button className="text-purple-400 hover:text-purple-300" onClick={() => moveToTeam(p, 'B')}>→B</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="flex gap-3">
        <TeamColumn team={teamA} label="Team A" color="text-blue-400" />
        <TeamColumn team={teamB} label="Team B" color="text-purple-400" />
      </div>

      {/* Handicap differential */}
      {(teamA.length > 0 || teamB.length > 0) && (
        <div className={`rounded-lg p-3 text-sm ${diff === 0 ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-amber-900/40 border border-amber-700'}`}>
          {diff === 0 ? (
            <span className="text-emerald-400">⚡ Evenly matched! No head start needed.</span>
          ) : (
            <span className="text-amber-300">
              <ChevronRight size={14} className="inline" /> <strong>{lowerTeam}</strong> gets a <strong>{diff}-goal head start</strong> (handicap differential)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
