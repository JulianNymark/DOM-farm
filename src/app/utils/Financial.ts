import { States } from "../components/FarmPlot"
import { log } from "./Logger"

const difficulityCoefficient = 2.5
const difficulityPower = 2

export const buyPlot = (idx: number, states: States) => {
  states.setActivePlots([...states.activePlots, idx])
  states.setPurchaseablePlots([])
}

export const getPlotPrice = (idx: number, totalDimLength: number): number => {
  const totalPlotCount = totalDimLength ** 2

  if (idx > totalPlotCount) {
    log.error(`idx (${idx}) greater than totalPlotCount (${totalPlotCount})`)
    return -1
  }

  const center = Math.floor(totalPlotCount / 2)
  console.log(center)

  const xDistanceFromCenter =
    Math.abs(idx % totalDimLength - Math.floor(totalDimLength / 2))
  const yDistanceFromCenter = Math.abs(
    Math.floor(idx / totalDimLength) - Math.floor(totalDimLength / 2)
  )

  const ringDistanceFromCenter = Math.max(xDistanceFromCenter, yDistanceFromCenter)

  return Math.floor((ringDistanceFromCenter * difficulityCoefficient)**difficulityPower)
}
