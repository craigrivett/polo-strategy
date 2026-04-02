'use client'
import { Target } from 'lucide-react'
import { Player } from '../types'

interface Props {
  teamA: Player[]
  teamB: Player[]
}

const POSITIONS = [
  { num: 3, role: 'Pivot / Quarterback', desc: 'Most skilled — controls play, sets up attacks', color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-700' },
  { num: 4, role: 'Back / Defender', desc: 'Second strongest — protects goal, first line of defence', color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-700' },
  { num: 2, role: 'Attacker / Midfielder', desc: 'Links play between back and front, versatile role', color: 'text-amber-400', bg: 'bg-amber-900/30 border-amber-700' },
  { num: 1, role: 'Forward Attacker', desc: 'Front of attack — speed and positioning key', color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-700' },
]

function assignPositions(players: Player[]) {
  const sorted = [...players].sort((a, b) => b.handicap - a.handicap)
  // order of assignment: #3 (best), #4 (2nd), #2 (3rd), #1 (4th)
  const order = [3, 4, 2, 1]
  const map: Record<number, Player | undefined> = {}
  order.forEach((pos, i) => { map[pos] = sorted[i] })
  return map
}

function TeamPositions({ players, label, color }: { players: Player[], label: string, color: string }) {
  if (players.length === 0) return null
  const assigned = assignPositions(players)

  return (
    <div>
      <h3 className={`text-sm font-bold mb-3 ${color}`}>{label}</h3>
      <div className="space-y-2">
        {POSITIONS.map(pos => {
          const p = assigned[pos.num]
          return (
            <div key={pos.num} className={`border rounded-lg px-3 py-2 ${pos.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-lg ${pos.color}`}>#{pos.num}</span>
                  <div>
                    <div className={`text-xs font-semibold ${pos.color}`}>{pos.role}</div>
                    <div className="text-xs text-slate-400">{pos.desc}</div>
                  </div>
                </div>
                {p ? (
                  <div className="text-right">
                    <div className="text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-amber-400">{p.handicap > 0 ? `+${p.handicap}` : p.handicap} HCP</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">—</div>
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
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
        <Target size={20} /> Position Strategy
      </h2>
      {!hasPlayers ? (
        <p className="text-slate-500 text-sm text-center py-4">Build your teams first to see position recommendations.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamPositions players={teamA} label="Team A" color="text-blue-400" />
          <TeamPositions players={teamB} label="Team B" color="text-purple-400" />
        </div>
      )}
    </div>
  )
}
