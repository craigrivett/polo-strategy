export interface Player {
  id: string
  name: string
  handicap: number
}

export type Position = 1 | 2 | 3 | 4

export interface TeamPlayer {
  player: Player
  position: Position
}

export interface Team {
  name: string
  players: TeamPlayer[]
}

export interface MatchSetup {
  teamA: Team
  teamB: Team
}
