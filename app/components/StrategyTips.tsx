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

function avg(players: Player[]) {
  if (!players.length) return 0
  return players.reduce((s, p) => s + p.handicap, 0) / players.length
}

export default function StrategyTips({ teamA, teamB }: Props) {
  const avgA = avg(teamA)
  const avgB = avg(teamB)
  const combinedAvg = avg([...teamA, ...teamB])
  const diff = Math.abs(teamA.reduce((s, p) => s + p.handicap, 0) - teamB.reduce((s, p) => s + p.handicap, 0))

  const contextualTips: { tip: string; tag: string; highlight?: boolean }[] = []

  if (teamA.length > 0 && teamB.length > 0) {
    if (combinedAvg > 5) {
      contextualTips.push({
        tip: "High-handicap match — expect a fast, attacking game. Focus on ride-offs, quick transitions, and exploiting space on the wings.",
        tag: "Match context",
        highlight: true,
      })
    }
    if (diff >= 4) {
      const lowerTeam = avgA <= avgB ? 'Team A' : 'Team B'
      contextualTips.push({
        tip: `${lowerTeam} has a significant handicap deficit. Recommended: tight defensive structure, protect your #4, limit open-field play, and use your head start goals strategically.`,
        tag: "Tactical",
        highlight: true,
      })
    } else if (diff <= 1) {
      contextualTips.push({
        tip: "Very evenly matched — this game will be decided by execution and pony fitness. Keep your #3 fresh and avoid unnecessary penalties.",
        tag: "Match context",
        highlight: true,
      })
    }
    if (teamA.length < 4 || teamB.length < 4) {
      contextualTips.push({
        tip: "Some positions are unfilled. In practice chukkas with fewer than 4-a-side, the #3 role becomes even more critical — adjust accordingly.",
        tag: "Setup",
        highlight: false,
      })
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
        <Lightbulb size={20} /> Strategy Tips
      </h2>

      {contextualTips.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide">Match-specific</p>
          {contextualTips.map((t, i) => (
            <div key={i} className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-3 py-2">
              <span className="text-xs font-bold text-amber-400 mr-2">[{t.tag}]</span>
              <span className="text-sm text-slate-200">{t.tip}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">General polo strategy</p>
        {GENERAL_TIPS.map((t, i) => (
          <div key={i} className="bg-slate-700/40 border border-slate-700 rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-slate-400 mr-2">[{t.tag}]</span>
            <span className="text-sm text-slate-300">{t.tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
