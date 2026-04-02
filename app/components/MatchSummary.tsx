'use client'
import { FileText, Printer } from 'lucide-react'
import { Player } from '../types'

interface Props {
  teamA: Player[]
  teamB: Player[]
}

const POSITION_ORDER = [3, 4, 2, 1]
const POSITION_LABELS: Record<number, string> = {
  1: 'Forward',
  2: 'Midfielder',
  3: 'Pivot',
  4: 'Back',
}
const POSITION_COLORS: Record<number, string> = {
  3: 'text-emerald-400',
  4: 'text-blue-400',
  2: 'text-amber-400',
  1: 'text-purple-400',
}

function assignPositions(players: Player[]): { pos: number; player: Player | null }[] {
  const sorted = [...players].sort((a, b) => b.handicap - a.handicap)
  const orderMap = [3, 4, 2, 1]
  return POSITION_ORDER.map((pos) => ({
    pos,
    player: sorted[orderMap.indexOf(pos)] ?? null,
  }))
}

export default function MatchSummary({ teamA, teamB }: Props) {
  if (teamA.length === 0 && teamB.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center text-2xl">📋</div>
        <p className="text-slate-400 text-sm font-medium text-center">Set up your teams to generate<br/>a match summary card.</p>
      </div>
    )
  }

  const hcpA = teamA.reduce((s, p) => s + p.handicap, 0)
  const hcpB = teamB.reduce((s, p) => s + p.handicap, 0)
  const diff = Math.abs(hcpA - hcpB)
  const lowerTeam = hcpA <= hcpB ? 'Team A' : 'Team B'
  const posA = assignPositions(teamA)
  const posB = assignPositions(teamB)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <FileText size={17} /> Match Card
        </h2>
        <button className="btn-secondary flex items-center gap-1.5 text-xs" onClick={() => window.print()}>
          <Printer size={13} /> Print
        </button>
      </div>

      {/* Match card */}
      <div id="match-summary" className="rounded-2xl overflow-hidden border border-slate-600/40 shadow-2xl shadow-black/50">

        {/* Card header */}
        <div className="px-5 py-4 text-center"
          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 50%, #162848 100%)' }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">🏇</span>
            <span className="font-black text-white text-lg tracking-tight">PoloIQ</span>
          </div>
          <p className="text-amber-400/70 text-xs font-medium">{dateStr}</p>
        </div>

        {/* Head start banner */}
        <div className={`px-5 py-3.5 text-center border-y ${
          diff === 0
            ? 'bg-emerald-900/40 border-emerald-700/30'
            : 'bg-amber-900/40 border-amber-700/30'
        }`}>
          {diff === 0 ? (
            <p className="text-emerald-300 font-bold text-sm">⚡ Even match — no head start required</p>
          ) : (
            <div>
              <p className="text-amber-300 font-bold text-sm">
                🏇 <span className="text-white">{lowerTeam}</span> starts with a{' '}
                <span className="text-amber-400 font-black text-xl">{diff}</span>-goal head start
              </p>
              <p className="text-amber-500/60 text-xs mt-0.5">Handicap differential</p>
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 divide-x divide-slate-700/50"
          style={{ background: 'rgba(10,22,40,0.95)' }}>
          {[
            { label: 'Team A', hcp: hcpA, positions: posA, accent: 'text-blue-400' },
            { label: 'Team B', hcp: hcpB, positions: posB, accent: 'text-purple-400' },
          ].map(({ label, hcp, positions, accent }) => (
            <div key={label} className="p-4">
              <div className={`font-black text-base ${accent} mb-0.5`}>{label}</div>
              <div className="text-xs text-slate-500 font-semibold mb-4">{hcp} HCP</div>
              <div className="space-y-3">
                {positions.map(({ pos, player }) => (
                  <div key={pos} className="flex items-start gap-2">
                    <div className={`text-xs font-black w-5 shrink-0 mt-0.5 ${POSITION_COLORS[pos]}`}>#{pos}</div>
                    <div>
                      {player ? (
                        <>
                          <div className="text-xs font-bold text-white leading-tight">{player.name}</div>
                          <div className="text-xs text-amber-400/80 font-semibold">
                            {player.handicap > 0 ? `+${player.handicap}` : player.handicap} · {POSITION_LABELS[pos]}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-600 italic">{POSITION_LABELS[pos]} — TBD</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 text-center border-t border-slate-700/30"
          style={{ background: 'rgba(10,22,40,0.8)' }}>
          <p className="text-xs text-slate-600">Generated by PoloIQ · polo-strategy.vercel.app</p>
        </div>
      </div>

      {/* Combined HCP summary */}
      <div className="card">
        <p className="section-label">Handicap summary</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Team A', hcp: hcpA, count: teamA.length, color: 'text-blue-400' },
            { label: 'Team B', hcp: hcpB, count: teamB.length, color: 'text-purple-400' },
          ].map(({ label, hcp, count, color }) => (
            <div key={label} className="card-inner text-center">
              <div className={`font-black text-2xl ${color}`}>{hcp}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label} · {count} players</div>
            </div>
          ))}
        </div>
        {diff > 0 && (
          <div className="mt-3 text-center text-xs text-slate-500">
            Differential: <span className="font-bold text-amber-400">{diff} goals</span>
          </div>
        )}
      </div>
    </div>
  )
}
