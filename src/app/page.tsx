"use client"

import { Button } from "@navikt/ds-react"
import { FarmPlot } from "./components/FarmPlot"
import React, { createContext } from "react"
import { WateringCanFillIcon } from "@navikt/aksel-icons"
import pino from "pino"

export const log = pino({ level: "debug" })

log.debug("debugtest!")
log.info("test")
log.warn("test")
log.error("test")

export default function Home() {
  return (
    <main className="flex flex-col justify-center">
      <h1 className="flex-initial m-auto">Farm</h1>
      <FarmPlot />
      <Button className="flex-initial w-[fit-content] m-auto">Buy plot</Button>
      <Button className="flex-initial w-[fit-content] m-auto">Plant</Button>
      <Button
        className="flex-initial w-[fit-content] m-auto"
        icon={<WateringCanFillIcon />}
      />
    </main>
  )
}
