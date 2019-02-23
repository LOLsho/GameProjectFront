export interface GameItem {
  name: string;
  lastTimeVisited?: string;
}

export type GameList = GameItem[];

export interface Game {
  name: string;
  imageSrc: string;
  component: any;
}

export type Games = Game[];
