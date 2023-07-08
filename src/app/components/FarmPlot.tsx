"use client"

import { BankNoteIcon, PlantIcon } from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React, { useState } from "react"
import "./FarmPlot.css"
import cl from "classnames"
import { log } from "../page"

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

const getAdjacentPlots = (idx: number): number[] => {
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

const omitIncludes = (initial: number[], other: number[]) => {
  return initial.filter((e) => !other.includes(e))
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
      const adjacentPlots = getAdjacentPlots(plot.idx)
      const purchaseable = omitIncludes(adjacentPlots, InitialActivePlots)
      states.setPurchaseablePlots(purchaseable)
      break
    case "purchaseable":
      states.setActivePlots([...states.activePlots, plot.idx])
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
                  "plot--purchaseable": isPurchaseable,
                })}
                onClick={() => {
                  handlePlotClick(plot, states)
                }}
                icon={
                  isPurchaseable ? (
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
