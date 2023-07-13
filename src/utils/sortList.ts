import { GameWithRate } from "../interfaces/home";

export function sortList(
  arr: GameWithRate[],
  order: "asc" | "desc"
): GameWithRate[] {
  const sortedArr = arr.sort((a, b) => {
    if (a.average === b.average) {
        return 0;
      }
      if (a.average === null) {
        return 1;
      }
      if (b.average === null) {
        return -1;
      }
      if (a.average === 0) {
        return 1;
      }
      if (b.average === 0) {
        return -1;
      }
      if (order === 'asc') {
        return a.average - b.average;
      } else {
        return b.average - a.average;
      }
  });

  console.log(sortedArr)

  return sortedArr;
}
