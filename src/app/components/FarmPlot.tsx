"use client"

import { PlantIcon } from "@navikt/aksel-icons"
import { Button } from "@navikt/ds-react"
import React from "react"
import "./FarmPlot.css"
import cl from "classnames"

const dimLength = 21 // odd numbers
const activeLength = 3 // odd numbers
const Plots: number[] = [...Array(dimLength * dimLength).keys()]
let ActivePlots: number[] = []

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

const handlePlotClick = (idx: number) => {
  console.log(`clicked ${idx}`)
}

export const FarmPlot = () => {
  return (
    <div className="flex justify-center">
      <div className="farm-button-grid">
        {Plots.map((element, idx) => {
          const isActive = ActivePlots.includes(idx)
          return (
            <div key={idx}>
              <Button
                className={cl("plot", { "plot--visible": isActive })}
                onClick={() => {
                  handlePlotClick(idx)
                }}
                icon={<PlantIcon aria-hidden />}
              ></Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
