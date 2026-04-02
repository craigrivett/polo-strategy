'use client'
import { useState } from 'react'
import { Plus, Trash2, Pencil, Users, Sparkles } from 'lucide-react'
import { Player } from '../types'

interface Props {
  players: Player[]
  onChange: (players: Player[]) => void
  onLoadDemo: () => void
}

export default function PlayerRoster({ players, onChange, onLoadDemo }: Props) {
  const [name, setName] = useState('')
  const [handicap, setHandicap] = useState(0)
  const [editId, setEditId] = useState<string | null>(null)

  const addPlayer = () => {
    if (!name.trim()) return
    if (editId) {
      onChange(players.map(p => p.id === editId ? { ...p, name: name.trim(), handicap } : p))
      setEditId(null)
    } else {
      onChange([...players, { id: crypto.randomUUID(), name: name.trim(), handicap }])
    }
    setName('')
    setHandicap(0)
  }

  const removePlayer = (id: string) => onChange(players.filter(p => p.id !== id))

  const startEdit = (p: Player) => {
    setEditId(p.id)
    setName(p.name)
    setHandicap(p.handicap)
  }

  const cancelEdit = () => {
    setEditId(null)
    setName('')
    setHandicap(0)
  }

  const handicapStyle = (h: number): string => {
    if (h >= 7) return 'bg-emerald-500 shadow-emerald-500/40'
    if (h >= 4) return 'bg-amber-500 shadow-amber-500/40'
    if (h >= 1) return 'bg-blue-500 shadow-blue-500/40'
    return 'bg-slate-500 shadow-slate-500/30'
  }

  const handicapLabel = (h: number) => h > 0 ? `+${h}` : `${h}`

  return (
    <div className="space-y-4">
      {/* Hero / Welcome — shown only when no players */}
      {players.length === 0 && (
        <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-500/5"
          style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #0a1628 60%, #162848 100%)' }}>
          <div className="px-5 pt-7 pb-5 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-xl"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
              🏇
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Welcome to PoloIQ</h2>
            <p className="text-amber-400/90 font-semibold text-sm mb-3">Your match-day strategy companion</p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Add your players, let PoloIQ balance the teams by handicap, assign positions, and surface tactical tips — all from the field.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-px bg-slate-700/30 border-t border-slate-700/40">
            {[
              { icon: '👥', label: 'Add players' },
              { icon: '⚡', label: 'Build teams' },
              { icon: '📋', label: 'Match card' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 py-4 px-2"
                style={{ background: 'rgba(10,22,40,0.5)' }}>
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Demo data button */}
          <div className="px-5 py-4 border-t border-slate-700/30 flex justify-center"
            style={{ background: 'rgba(10,22,40,0.3)' }}>
            <button
              onClick={onLoadDemo}
              className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <Sparkles size={14} />
              Load demo match data
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      <div className="card">
        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-4">
          <Users size={17} />
          {editId ? 'Edit Player' : 'Add Player'}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <input
            className="input flex-1 min-w-32"
            placeholder="Player name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPlayer()}
          />
          <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600/60 rounded-xl px-4 py-2.5">
            <span className="text-xs text-slate-400 font-semibold">HCP</span>
            <input
              type="number"
              min={-2}
              max={10}
              className="bg-transparent text-white w-10 text-sm focus:outline-none font-bold"
              value={handicap}
              onChange={e => setHandicap(Number(e.target.value))}
            />
          </div>
          <button className="btn-primary flex items-center gap-1.5" onClick={addPlayer}>
            <Plus size={15} />
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button className="btn-secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </div>

      {/* Player list */}
      {players.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Squad
              <span className="text-xs font-semibold text-slate-500 bg-slate-700/60 px-2 py-0.5 rounded-full">
                {players.length}
              </span>
            </h2>
            <button
              onClick={onLoadDemo}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 transition-colors font-medium"
            >
              <Sparkles size={11} /> Demo data
            </button>
          </div>
          <ul className="space-y-2">
            {players.sort((a, b) => b.handicap - a.handicap).map(p => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/40 hover:border-slate-600/60 rounded-xl px-3.5 py-2.5 cursor-pointer transition-all group"
                onClick={() => startEdit(p)}
              >
                <div className="flex items-center gap-3">
                  <span className={`badge shadow-md ${handicapStyle(p.handicap)} text-slate-900`}>
                    {handicapLabel(p.handicap)}
                  </span>
                  <span className="font-semibold text-sm text-white">{p.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                    onClick={e => { e.stopPropagation(); startEdit(p) }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    onClick={e => { e.stopPropagation(); removePlayer(p.id) }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
