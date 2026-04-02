'use client'
import { Lightbulb } from 'lucide-react'
import { Player } from '../types'

interface Props {
  teamA: Player[]
  teamB: Player[]
}

const GENERAL_TIPS = [
  { tip: "The #3 player is your quarterback — they dictate pace, so position them centrally and let them read the play.", tag: "Positioning" },
  { tip: "On the throw-in, your #3 and opposing #3 battle for possession. Win this and you control the chukka.", tag: "Set piece" },
  { tip: "Ride-offs are legal and tactical — use them to displace opponents from the line of the ball.", tag: "Defence" },
  { tip: "In polo, the right of way belongs to the player following the line of the ball. Discipline here avoids penalties.", tag: "Rules" },
  { tip: "Rotate ponies between chukkas — a fresh horse in the last chukka can be the difference.", tag: "Horses" },
  { tip: "The back (#4) should resist the urge to attack. Staying deep prevents counter-attacks on your goal.", tag: "Defence" },
]

const TAG_COLORS: Record<string, string> = {
  Positioning: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  'Set piece': 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  Defence: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  Rules: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
  Horses: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  Tactical: 'bg-red-900/40 text-red-300 border-red-700/40',
  'Match context': 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  Setup: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
}

function avg(players: Player[]) {
  if (!players.length) return 0
  return players.reduce((s, p) => s + p.handicap, 0) / players.length
}

export default function StrategyTips({ teamA, teamB }: Props) {
  const avgA = avg(teamA)
  const avgB = avg(teamB)
  const combinedAvg = avg([...teamA, ...teamB])
  const hcpA = teamA.reduce((s, p) => s + p.handicap, 0)
  const hcpB = teamB.reduce((s, p) => s + p.handicap, 0)
  const diff = Math.abs(hcpA - hcpB)

  const contextualTips: { tip: string; tag: string }[] = []

  if (teamA.length > 0 && teamB.length > 0) {
    if (combinedAvg > 5) {
      contextualTips.push({
        tip: "High-handicap match — expect a fast, attacking game. Focus on ride-offs, quick transitions, and exploiting space on the wings.",
        tag: "Match context",
      })
    }
    if (diff >= 4) {
      const lowerTeam = avgA <= avgB ? 'Team A' : 'Team B'
      contextualTips.push({
        tip: `${lowerTeam} has a significant handicap deficit. Tight defensive structure, protect your #4, limit open-field play, and use your head-start goals strategically.`,
        tag: "Tactical",
      })
    } else if (diff <= 1) {
      contextualTips.push({
        tip: "Very evenly matched — this game will be decided by execution and pony fitness. Keep your #3 fresh and avoid unnecessary penalties.",
        tag: "Match context",
      })
    }
    if (teamA.length < 4 || teamB.length < 4) {
      contextualTips.push({
        tip: "Some positions are unfilled. In practice chukkas with fewer than 4-a-side, the #3 role becomes even more critical — adjust accordingly.",
        tag: "Setup",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Lightbulb size={17} /> Strategy Tips
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {contextualTips.length > 0 ? 'Match-specific insights + general polo tactics' : 'General polo tactics'}
        </p>
      </div>

      {contextualTips.length > 0 && (
        <div className="card border-amber-500/20">
          <p className="section-label">Match-specific</p>
          <div className="space-y-2.5">
            {contextualTips.map((t, i) => (
              <div key={i} className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 mt-0.5 shrink-0">⚡</span>
                  <div>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-lg border mb-1.5 ${TAG_COLORS[t.tag] || TAG_COLORS['Rules']}`}>
                      {t.tag}
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed">{t.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <p className="section-label">General polo</p>
        <div className="space-y-2.5">
          {GENERAL_TIPS.map((t, i) => (
            <div key={i} className="bg-slate-700/30 border border-slate-700/40 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="text-slate-500 mt-0.5 shrink-0">💡</span>
                <div>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-lg border mb-1.5 ${TAG_COLORS[t.tag] || TAG_COLORS['Rules']}`}>
                    {t.tag}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">{t.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
