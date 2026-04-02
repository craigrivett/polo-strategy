'use client'
import { useState } from 'react'
import { Plus, Trash2, UserCircle } from 'lucide-react'
import { Player } from '../types'

interface Props {
  players: Player[]
  onChange: (players: Player[]) => void
}

export default function PlayerRoster({ players, onChange }: Props) {
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

  const handicapColor = (h: number) => {
    if (h >= 7) return 'bg-emerald-500'
    if (h >= 4) return 'bg-amber-500'
    if (h >= 1) return 'bg-blue-500'
    return 'bg-slate-500'
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
        <UserCircle size={20} /> Player Roster
      </h2>

      {/* Add / Edit form */}
      <div className="flex gap-2 flex-wrap">
        <input
          className="input flex-1 min-w-32"
          placeholder="Player name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPlayer()}
        />
        <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-3">
          <span className="text-xs text-slate-400">HCP</span>
          <input
            type="number"
            min={-2}
            max={10}
            className="bg-transparent text-white w-12 text-sm focus:outline-none"
            value={handicap}
            onChange={e => setHandicap(Number(e.target.value))}
          />
        </div>
        <button className="btn-primary" onClick={addPlayer}>
          <Plus size={16} className="inline" /> {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button className="btn-secondary" onClick={() => { setEditId(null); setName(''); setHandicap(0) }}>
            Cancel
          </button>
        )}
      </div>

      {/* Player list */}
      {players.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-4">No players yet. Add your squad above.</p>
      ) : (
        <ul className="space-y-2">
          {players.sort((a, b) => b.handicap - a.handicap).map(p => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-700"
              onClick={() => startEdit(p)}
            >
              <div className="flex items-center gap-3">
                <span className={`badge ${handicapColor(p.handicap)} !w-9 !h-7 rounded-md text-slate-900 font-bold text-xs`}>
                  {p.handicap > 0 ? `+${p.handicap}` : p.handicap}
                </span>
                <span className="font-medium text-sm">{p.name}</span>
              </div>
              <button
                className="text-slate-500 hover:text-red-400 transition-colors"
                onClick={e => { e.stopPropagation(); removePlayer(p.id) }}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-500 text-right">{players.length} player{players.length !== 1 ? 's' : ''} in roster</p>
    </div>
  )
}
