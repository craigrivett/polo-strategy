'use client'
import { Users, ArrowLeftRight, Zap, AlertCircle } from 'lucide-react'
import { Player } from '../types'

interface Props {
  players: Player[]
  teamA: Player[]
  teamB: Player[]
  onTeamsChange: (a: Player[], b: Player[]) => void
}

export default function TeamBuilder({ players, teamA, teamB, onTeamsChange }: Props) {
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
  const hcpA = totalHcp(teamA)
  const hcpB = totalHcp(teamB)
  const diff = Math.abs(hcpA - hcpB)
  const lowerTeam = hcpA <= hcpB ? 'Team A' : 'Team B'
  const unassigned = players.filter(p => !teamA.find(x => x.id === p.id) && !teamB.find(x => x.id === p.id))

  if (players.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center text-2xl">👥</div>
        <p className="text-slate-400 text-sm font-medium text-center">Add players to the Roster first,<br/>then build your teams here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Users size={17} /> Team Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Tap arrows to swap players between teams</p>
        </div>
        <button className="btn-primary flex items-center gap-1.5 text-xs" onClick={autoSplit}>
          <Zap size={13} /> Auto-split
        </button>
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div className="card border-amber-500/20">
          <p className="section-label flex items-center gap-1.5"><AlertCircle size={11} /> Unassigned players</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-slate-700/50 border border-slate-600/40 rounded-xl px-3 py-1.5 text-xs">
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-amber-400 font-bold">{p.handicap > 0 ? `+${p.handicap}` : p.handicap}</span>
                <div className="flex gap-1 ml-1">
                  <button
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-bold px-1.5 py-0.5 rounded-lg transition-colors text-xs"
                    onClick={() => moveToTeam(p, 'A')}
                  >A</button>
                  <button
                    className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-bold px-1.5 py-0.5 rounded-lg transition-colors text-xs"
                    onClick={() => moveToTeam(p, 'B')}
                  >B</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team columns */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { team: teamA, label: 'Team A', target: 'B' as const, color: 'text-blue-400', borderColor: 'border-blue-500/30', bg: 'bg-blue-900/10' },
          { team: teamB, label: 'Team B', target: 'A' as const, color: 'text-purple-400', borderColor: 'border-purple-500/30', bg: 'bg-purple-900/10' },
        ].map(({ team, label, target, color, borderColor, bg }) => (
          <div key={label} className={`border ${borderColor} ${bg} rounded-2xl p-3`}>
            <div className={`text-sm font-black mb-1 ${color}`}>{label}</div>
            <div className="text-xs text-slate-500 mb-3 font-semibold">{totalHcp(team)} HCP total</div>
            <div className="space-y-1.5 min-h-20">
              {team.length === 0 && (
                <p className="text-slate-600 text-xs text-center py-4">—</p>
              )}
              {team.sort((a, b) => b.handicap - a.handicap).map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/40 rounded-xl px-2.5 py-1.5 text-xs gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-amber-400 shrink-0">{p.handicap > 0 ? `+${p.handicap}` : p.handicap}</span>
                    <span className="text-white font-medium truncate">{p.name}</span>
                  </div>
                  <button
                    className="text-slate-500 hover:text-amber-400 transition-colors shrink-0"
                    onClick={() => moveToTeam(p, target)}
                    title={`Move to Team ${target}`}
                  >
                    <ArrowLeftRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Differential banner */}
      {(teamA.length > 0 || teamB.length > 0) && (
        <div className={`rounded-2xl px-4 py-3.5 text-sm font-semibold border ${
          diff === 0
            ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300'
            : 'bg-amber-900/30 border-amber-700/50 text-amber-300'
        }`}>
          {diff === 0 ? (
            <span>⚡ Even match — no head start needed</span>
          ) : (
            <span>
              🏇 <strong>{lowerTeam}</strong> starts with a <strong className="text-white">{diff}-goal</strong> head start
            </span>
          )}
        </div>
      )}
    </div>
  )
}
