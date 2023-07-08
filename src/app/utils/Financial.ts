import { FarmState, totalDimLength } from "../components/FarmPlot"
import { GameState } from "../page"
import { log } from "./Logger"

const difficulityCoefficient = 2.5
const difficulityPower = 2

export const buyPlot = (
  idx: number,
  farmState: FarmState,
  gameState: GameState
) => {
  const price = getPlotPrice(idx, totalDimLength)
  const afterPurchaseWallet = gameState.wallet - price

  if (afterPurchaseWallet < 0) {
    gameState.setModalMessage("You can't afford that!")
    gameState.setModalOpen(true)
    return
  }
  farmState.setPurchaseablePlots([])
  gameState.setMode("normal")
  farmState.setActivePlots([...farmState.activePlots, idx])

  gameState.setWallet(afterPurchaseWallet)
}

export const getPlotPrice = (idx: number, totalDimLength: number): number => {
  const totalPlotCount = totalDimLength ** 2

  if (idx > totalPlotCount) {
    log.error(`idx (${idx}) greater than totalPlotCount (${totalPlotCount})`)
    return -1
  }

  const center = Math.floor(totalPlotCount / 2)

  const xDistanceFromCenter = Math.abs(
    (idx % totalDimLength) - Math.floor(totalDimLength / 2)
  )
  const yDistanceFromCenter = Math.abs(
    Math.floor(idx / totalDimLength) - Math.floor(totalDimLength / 2)
  )

  const ringDistanceFromCenter = Math.max(
    xDistanceFromCenter,
    yDistanceFromCenter
  )

  return Math.floor(
    (ringDistanceFromCenter * difficulityCoefficient) ** difficulityPower
  )
}
