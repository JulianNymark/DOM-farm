"use client"

import { BankNoteIcon, KronerIcon, PlantIcon } from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React, { useState } from "react"
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

const totalDimLength = 21 // odd numbers
const initialActiveDimLength = 3 // odd numbers
const Plots: number[] = [...Array(totalDimLength * totalDimLength).keys()]

export type States = {
  setPurchaseablePlots: React.Dispatch<React.SetStateAction<number[]>>
  setActivePlots: React.Dispatch<React.SetStateAction<number[]>>
  purchaseablePlots: number[]
  activePlots: number[]
  wallet: number
  setWallet: React.Dispatch<React.SetStateAction<number>>
}

const handlePlotClick = (plot: PlotInfo, states: States) => {
  log.debug(JSON.stringify({ plot }, null, 2))

  switch (plot.type) {
    case "active":
      const adjacentPlots = getAdjacentPlots(plot.idx, totalDimLength)
      const purchaseable = omitIncludes(adjacentPlots, states.activePlots)
      states.setPurchaseablePlots(purchaseable)
      break
    case "purchaseable":
      log.debug(`price: ${getPlotPrice(plot.idx, totalDimLength)}`)
      buyPlot(plot.idx, states)
      break
    case "inactive":
      break
  }
}

export const FarmPlot = () => {
  const [purchaseablePlots, setPurchaseablePlots] = useState<number[]>([])
  const [activePlots, setActivePlots] = useState<number[]>(
    initialActivePlots(initialActiveDimLength, totalDimLength)
  )
  const [wallet, setWallet] = useState<number>(10)

  const states: States = {
    purchaseablePlots,
    setPurchaseablePlots,
    activePlots,
    setActivePlots,
    wallet,
    setWallet,
  }

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
                  handlePlotClick(plot, states)
                }}
                icon={
                  isPurchaseable && !isActive ? (
                    <KronerIcon className="icon" aria-hidden />
                  ) : (
                    <PlantIcon className="icon" aria-hidden />
                  )
                }
              >{isPurchaseable ? plotPrice : ''}</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
