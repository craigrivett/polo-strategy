'use client'
import { Target } from 'lucide-react'
import { Player } from '../types'

interface Props {
  teamA: Player[]
  teamB: Player[]
}

const POSITIONS = [
  {
    num: 3,
    role: 'Pivot',
    fullRole: 'Pivot / Quarterback',
    desc: 'Dictates play, sets attacks',
    color: 'text-emerald-400',
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-700/40',
    badge: 'bg-emerald-500 shadow-emerald-500/40',
  },
  {
    num: 4,
    role: 'Back',
    fullRole: 'Back / Defender',
    desc: 'Protects goal, first line of defence',
    color: 'text-blue-400',
    bg: 'bg-blue-900/20',
    border: 'border-blue-700/40',
    badge: 'bg-blue-500 shadow-blue-500/40',
  },
  {
    num: 2,
    role: 'Midfield',
    fullRole: 'Attacker / Midfielder',
    desc: 'Links back to front, versatile',
    color: 'text-amber-400',
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/40',
    badge: 'bg-amber-500 shadow-amber-500/40',
  },
  {
    num: 1,
    role: 'Forward',
    fullRole: 'Forward Attacker',
    desc: 'Speed and positioning at the front',
    color: 'text-purple-400',
    bg: 'bg-purple-900/20',
    border: 'border-purple-700/40',
    badge: 'bg-purple-500 shadow-purple-500/40',
  },
]

function assignPositions(players: Player[]) {
  const sorted = [...players].sort((a, b) => b.handicap - a.handicap)
  const order = [3, 4, 2, 1]
  const map: Record<number, Player | undefined> = {}
  order.forEach((pos, i) => { map[pos] = sorted[i] })
  return map
}

function TeamPositions({ players, label, accent }: { players: Player[], label: string, accent: string }) {
  if (players.length === 0) return null
  const assigned = assignPositions(players)

  return (
    <div>
      <div className={`text-sm font-black mb-3 ${accent}`}>{label}</div>
      <div className="space-y-2">
        {POSITIONS.map(pos => {
          const p = assigned[pos.num]
          return (
            <div key={pos.num} className={`border ${pos.border} ${pos.bg} rounded-xl px-3.5 py-3`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-7 rounded-lg flex items-center justify-center font-black text-sm text-slate-900 shadow-md ${pos.badge}`}>
                    #{pos.num}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${pos.color}`}>{pos.fullRole}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{pos.desc}</div>
                  </div>
                </div>
                {p ? (
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white">{p.name}</div>
                    <div className="text-xs text-amber-400 font-semibold">{p.handicap > 0 ? `+${p.handicap}` : p.handicap}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 italic">Unassigned</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PositionStrategy({ teamA, teamB }: Props) {
  const hasPlayers = teamA.length > 0 || teamB.length > 0

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Target size={17} /> Position Strategy
        </h2>
        <p className="text-xs text-slate-500 mt-1">Assignments based on handicap — highest rated takes #3</p>
      </div>

      {!hasPlayers ? (
        <div className="card flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center text-2xl">🎯</div>
          <p className="text-slate-400 text-sm font-medium text-center">Build your teams first<br/>to see position recommendations.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {teamA.length > 0 && (
            <div className="card border-blue-500/20">
              <TeamPositions players={teamA} label="Team A" accent="text-blue-400" />
            </div>
          )}
          {teamB.length > 0 && (
            <div className="card border-purple-500/20">
              <TeamPositions players={teamB} label="Team B" accent="text-purple-400" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
