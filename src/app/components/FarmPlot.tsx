"use client"

import {
  BankNoteIcon,
  KronerIcon,
  PlantIcon,
  WavesIcon,
} from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React, { useEffect, useState } from "react"
import "./FarmPlot.css"
import cl from "classnames"
import { log } from "../utils/Logger"
import {
  PlotInfo,
  getAdjacentPlots,
  initialActivePlots,
  omitIncludes,
} from "../utils/Plot"
import { buyPlot, getPlotPrice } from "../utils/Financial"
import { GameState } from "../page"
import { StateSetter } from "../utils/Types"

export const totalDimLength = 21 // odd numbers
const initialActiveDimLength = 3 // odd numbers
const Plots: number[] = [...Array(totalDimLength * totalDimLength).keys()]

export type FarmState = {
  setPurchaseablePlots: StateSetter<number[]>
  setActivePlots: StateSetter<number[]>
  setWallet: StateSetter<number>
  purchaseablePlots: number[]
  activePlots: number[]
  wallet: number
}

const handlePlotClick = (
  plot: PlotInfo,
  states: FarmState,
  gameState: GameState
) => {
  log.debug(JSON.stringify({ plot }, null, 2))

  switch (plot.type) {
    case "active":
      break
    case "purchaseable":
      buyPlot(plot.idx, states, gameState)
      break
    case "inactive":
      break
  }
}

export const FarmPlot = ({ gameState }: { gameState: GameState }) => {
  const [purchaseablePlots, setPurchaseablePlots] = useState<number[]>([])
  const [activePlots, setActivePlots] = useState<number[]>(
    initialActivePlots(initialActiveDimLength, totalDimLength)
  )
  const [wallet, setWallet] = useState<number>(10)

  const states: FarmState = {
    purchaseablePlots,
    setPurchaseablePlots,
    activePlots,
    setActivePlots,
    wallet,
    setWallet,
  }

  useEffect(() => {
    switch (gameState.mode) {
      case "buySelect":
        let plots = new Set<number>()
        for (let activePlot of activePlots) {
          const adjacentPlots = getAdjacentPlots(activePlot, totalDimLength)
          const adjacentPurchaseablePlots = omitIncludes(
            adjacentPlots,
            activePlots
          )
          for (let p of adjacentPurchaseablePlots) {
            plots.add(p)
          }
        }
        setPurchaseablePlots([...plots])
        break
      case "normal":
        setPurchaseablePlots([])
        break
      case "plantSelect":
        break
    }
  }, [gameState])

  return (
    <div className="flex justify-center">
      <div className="farm-button-grid">
        {Plots.map((element, idx) => {
          const isActive = activePlots.includes(idx)
          const plot: PlotInfo = {
            idx,
            type: isActive ? "active" : "inactive",
          }
          const isPurchaseable = purchaseablePlots.includes(idx)
          if (isPurchaseable) {
            plot.type = "purchaseable"
          }
          const plotPrice = getPlotPrice(idx, totalDimLength)

          return (
            <div key={idx}>
              <Button
                className={cl("plot", {
                  "plot--visible": isActive || isPurchaseable,
                  "plot--purchaseable": isPurchaseable && !isActive,
                })}
                onClick={() => {
                  handlePlotClick(plot, states, gameState)
                }}
                icon={
                  isPurchaseable && !isActive ? (
                    <KronerIcon className="icon" aria-hidden />
                  ) : (
                    <WavesIcon className="icon" aria-hidden />
                  )
                }
              >
                {isPurchaseable ? plotPrice : ""}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
