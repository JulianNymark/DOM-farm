"use client"

import { Button } from "@navikt/ds-react"
import { FarmPlot } from "./components/FarmPlot"
import React from "react"
import { WateringCanFillIcon } from "@navikt/aksel-icons"

export default function Home() {
  return (
    <main className="flex flex-col justify-center">
      <h1 className="flex-initial m-auto">Farm</h1>
      <FarmPlot />
      <div className="flex-initial flex m-auto justify-between w-[400px]">
        <Button>
          Buy plot (b)
        </Button>
        <Button>
          Plant (p)
        </Button>
        <Button
          icon={<WateringCanFillIcon />}
        >
          (w)
        </Button>
      </div>
    </main>
  )
}
