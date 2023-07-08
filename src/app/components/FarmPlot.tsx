"use client"

import { BankNoteIcon, PlantIcon } from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React, { useState } from "react"
import "./FarmPlot.css"
import cl from "classnames"
import { log } from "../utils/Logger"
import { getAdjacentPlots, omitIncludes } from "../utils/PlotUtils"

const dimLength = 21 // odd numbers
const activeLength = 3 // odd numbers
const Plots: number[] = [...Array(dimLength * dimLength).keys()]
let InitialActivePlots: number[] = []

export type PlotInfo = {
  idx: number
  type: "active" | "purchaseable" | "inactive"
}

export type States = {
  setPurchaseablePlots: React.Dispatch<React.SetStateAction<number[]>>,
  setActivePlots: React.Dispatch<React.SetStateAction<number[]>>,
  purchaseablePlots: number[]
  activePlots: number[]
}

for (let rowIdx of [...Array(activeLength).keys()]) {
  const activeRow = [...Array(activeLength).keys()].map(
    (e) =>
      e +
      Math.floor((dimLength * dimLength) / 2) +
      dimLength * rowIdx -
      Math.floor(activeLength / 2) * dimLength -
      Math.floor(activeLength / 2)
  )
  InitialActivePlots = InitialActivePlots.concat(activeRow)
}

const handlePlotClick = (
  plot: PlotInfo,
  states: States,
) => {
  log.debug(JSON.stringify({ plot }, null, 2))

  switch (plot.type) {
    case "active":
      const adjacentPlots = getAdjacentPlots(plot.idx, dimLength)
      const purchaseable = omitIncludes(adjacentPlots, states.activePlots)
      states.setPurchaseablePlots(purchaseable)
      break
    case "purchaseable":
      states.setActivePlots([...states.activePlots, plot.idx])
      states.setPurchaseablePlots([])
      break
    case "inactive":
      break
  }
}

export const FarmPlot = () => {
  const [purchaseablePlots, setPurchaseablePlots] = useState<number[]>([])
  const [activePlots, setActivePlots] = useState<number[]>(InitialActivePlots)
  const states: States = {
    purchaseablePlots,
    setPurchaseablePlots,
    activePlots,
    setActivePlots,
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
                    <BankNoteIcon aria-hidden />
                  ) : (
                    <PlantIcon aria-hidden />
                  )
                }
              ></Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
