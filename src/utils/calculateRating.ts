import { GameWithRate, IGame, ListRatings } from "../interfaces/home";

export function calculateRating(
  listRatings: ListRatings[],
  games: IGame[]
): GameWithRate[] {
  const newList = games.map((g) => {
    const r = listRatings.find((r) => r.game_id === g.id);
    if (r && r.rate.length > 0) {
      const avr =
        r.rate.reduce((accumulator, value) => accumulator + value, 0) /
        r.rate.length;
      return { ...g, rate: r.rate, average: avr };
    }
    return { ...g, rate: [], average: 0 };
  });
  return newList as GameWithRate[];
}
