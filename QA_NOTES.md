# PoloIQ — QA Notes

## What Was Built
A mobile-first Next.js 14 (App Router) polo strategy MVP with 5 core sections:

1. **Roster** — Add/edit/delete players with handicaps (-2 to +10). Sorted by handicap. Persists to localStorage.
2. **Teams** — Assign players to Team A / Team B manually or auto-split (handicap-balanced snake draft). Shows handicap differential and head start calculation.
3. **Positions** — Recommends #1–#4 positions based on handicap ranking (per polo convention: #3 = best player).
4. **Tips** — Context-aware strategy tips based on team composition + general polo tips.
5. **Summary** — Printable match card with head start banner, team lineups, and positions.

## Test Checklist
- [ ] Add 8 players with varied handicaps (-2 through 10)
- [ ] Edit a player name/handicap — verify updates reflected in teams
- [ ] Delete a player — verify removed from teams automatically
- [ ] Auto-split — verify teams are roughly balanced by handicap
- [ ] Manual assign — move players between teams using →A / →B buttons
- [ ] Switch team — use ⇄ arrows in team columns
- [ ] Verify handicap differential and head start label are correct
- [ ] Position tab — verify #3 gets highest handicap player
- [ ] Tips tab — add a high-handicap match (avg > 5) and confirm contextual tip appears
- [ ] Tips tab — make teams uneven (diff ≥ 4) and confirm defensive tip appears
- [ ] Summary — verify head start banner shows correct team
- [ ] Print button triggers browser print dialog
- [ ] Refresh page — verify state persists (localStorage)
- [ ] Mobile view — test on 375px width

## Known Limitations
- No drag-and-drop (click-based assignment only)
- No backend — all state is localStorage only, not shareable between devices
- Image generation quota was exhausted — logo is a hand-crafted SVG
- No authentication or multi-match history
- Handicap input allows out-of-range values if typed manually (no server validation)
