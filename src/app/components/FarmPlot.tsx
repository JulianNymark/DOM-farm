"use client"

import { BankNoteIcon, PlantIcon } from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React, { useState } from "react"
import "./FarmPlot.css"
import cl from "classnames"

const dimLength = 21 // odd numbers
const activeLength = 3 // odd numbers
const Plots: number[] = [...Array(dimLength * dimLength).keys()]
let ActivePlots: number[] = []
let PurchaseablePlots: number[] = []

const getAdjacentPlots = (idx: number): number[] => {
  const initialAdjacents = [
    [-dimLength - 1, -dimLength, -dimLength + 1],
    [-1, 0, +1],
    [dimLength - 1, dimLength, dimLength + 1],
  ]

  if (idx < dimLength) {
    console.log("top row")
    initialAdjacents[0] = [0, 0, 0]
  } else if (idx >= dimLength * (dimLength - 1)) {
    console.log("bottom row")
    initialAdjacents[2] = [0, 0, 0]
  }

  if (idx % dimLength == 0) {
    console.log("left col")
    initialAdjacents[0][0] = 0
    initialAdjacents[1][0] = 0
    initialAdjacents[2][0] = 0
  } else if (idx % dimLength == dimLength - 1) {
    console.log("right col")
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
  ActivePlots = ActivePlots.concat(activeRow)
}
console.log(ActivePlots.concat())

const handlePlotClick = (
  idx: number,
  setPurchaseablePlots: React.Dispatch<React.SetStateAction<number[]>>
) => {
  console.log(`clicked ${idx}`)
  const adjacentPlots = getAdjacentPlots(idx)
  const purchaseable = omitIncludes(adjacentPlots, ActivePlots)
  console.log(purchaseable)
  setPurchaseablePlots(purchaseable)
}

export const FarmPlot = () => {
  const [purchaseablePlots, setPurchaseablePlots] = useState<number[]>([])

  return (
    <div className="flex justify-center">
      <div className="farm-button-grid">
        {Plots.map((element, idx) => {
          const isActive = ActivePlots.includes(idx)
          const isPurchaseable = purchaseablePlots.includes(idx)
          return (
            <div key={idx}>
              <Button
                className={cl("plot", {
                  "plot--visible": isActive || isPurchaseable,
                  "plot--purchaseable": isPurchaseable,
                })}
                onClick={() => {
                  handlePlotClick(idx, setPurchaseablePlots)
                }}
                icon={isPurchaseable ? <BankNoteIcon aria-hidden /> : <PlantIcon aria-hidden />}
              ></Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
