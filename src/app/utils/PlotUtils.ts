import { log } from "./Logger"

export const getAdjacentPlots = (idx: number, dimLength: number): number[] => {
  const initialAdjacents = [
    [-dimLength - 1, -dimLength, -dimLength + 1],
    [-1, 0, +1],
    [dimLength - 1, dimLength, dimLength + 1],
  ]

  if (idx < dimLength) {
    log.debug("top row")
    initialAdjacents[0] = [0, 0, 0]
  } else if (idx >= dimLength * (dimLength - 1)) {
    log.debug("bottom row")
    initialAdjacents[2] = [0, 0, 0]
  }

  if (idx % dimLength == 0) {
    log.debug("left col")
    initialAdjacents[0][0] = 0
    initialAdjacents[1][0] = 0
    initialAdjacents[2][0] = 0
  } else if (idx % dimLength == dimLength - 1) {
    log.debug("right col")
    initialAdjacents[0][2] = 0
    initialAdjacents[1][2] = 0
    initialAdjacents[2][2] = 0
  }

  const finalAdjacents = initialAdjacents
    .flat()
    .filter((e) => e !== 0)
    .map((e) => e + idx)

  return finalAdjacents
}

export const omitIncludes = (initial: number[], other: number[]) => {
  return initial.filter((e) => !other.includes(e))
}
