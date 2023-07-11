export interface IGame {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}

export interface IFavorite {
  id?: string;
  user_id: string;
  game_id: number;
}

export interface User {
  id: string;
  token: string;
}

export interface ListRatings {
  id: string;
  game_id: number;
  rate: [number];
}

export interface GameWithRate extends IGame {
  average: number;
  rate: [number];
}
