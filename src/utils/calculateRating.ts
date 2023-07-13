import { GameWithRate, IGame, ListRatings } from "../interfaces/home";

export function calculateRating(
  listRatings: ListRatings[],
  games: IGame[]
): GameWithRate[] {
  const newList = games.map((g) => {
    const r = listRatings.find((r) => Number(r.id) === g.id);
    if (r && r.ratingsList.length > 0) {
      const avr =
        r.ratingsList.reduce((accumulator, value) => accumulator + value, 0) /
        r.ratingsList.length;
      return { ...g, rate: r.ratingsList, average: avr };
    }
    return { ...g, rate: [], average: 0 };
  });
  return newList as GameWithRate[];
}
