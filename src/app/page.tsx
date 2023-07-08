"use client"

import { BodyLong, Button, Modal, Stepper, TextField } from "@navikt/ds-react"
import { FarmPlot } from "./components/FarmPlot"
import React, { useEffect, useState } from "react"
import { WateringCanFillIcon } from "@navikt/aksel-icons"
import { StateSetter } from "./utils/Types"
import cl from "classnames"
import "./page.css"

type GameMode = "normal" | "buySelect" | "plantSelect"

export type GameState = {
  setActiveStep: StateSetter<number>
  setWallet: StateSetter<number>
  setMode: StateSetter<GameMode>
  setModalMessage: StateSetter<string>
  setModalOpen: StateSetter<boolean>
  activeStep: number
  wallet: number
  mode: GameMode
  modalMessage: string
  modalOpen: boolean
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(1)
  const [wallet, setWallet] = useState(10)
  const [mode, setMode] = useState<GameMode>("normal")
  const [modalMessage, setModalMessage] = useState<string>("")
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    Modal.setAppElement('#modal-root')
  }, [])

  const gameState = {
    activeStep,
    setActiveStep,
    wallet,
    setWallet,
    mode,
    setMode,
    modalMessage,
    setModalMessage,
    modalOpen,
    setModalOpen,
  }

  return (
    <main className="flex flex-col justify-center" id="modal-root">
      <h1 className="flex-initial m-auto">DOM Farm</h1>
      <FarmPlot gameState={gameState} />
      <div className="flex flex-row justify-center mt-[5px]">
        <div className="mr-[20px]">
          <div className="flex-initial flex m-auto justify-between w-[400px]">
            <Button
              onClick={() => {
                setMode(mode === "buySelect" ? "normal" : "buySelect")
              }}
              className={cl("buy-button", {
                "buy-button--active": mode === "buySelect",
              })}
            >
              Buy plot (b)
            </Button>
            <Button
              onClick={() => {
                setMode(mode === "plantSelect" ? "normal" : "plantSelect")
              }}
            >
              Plant (p)
            </Button>
            <Button icon={<WateringCanFillIcon />}>(w)</Button>
          </div>
          <Stepper
            className="w-[800px] m-auto mt-[20px]"
            activeStep={activeStep}
            orientation="horizontal"
            interactive={false}
          >
            <Stepper.Step>Mon</Stepper.Step>
            <Stepper.Step>Tue</Stepper.Step>
            <Stepper.Step>Wed</Stepper.Step>
            <Stepper.Step>Thu</Stepper.Step>
            <Stepper.Step>Fri</Stepper.Step>
            <Stepper.Step>Sat</Stepper.Step>
            <Stepper.Step>Pay rent!</Stepper.Step>
          </Stepper>
        </div>
        <div className="flex flex-col">
          <TextField label="wallet" value={wallet} readOnly />
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
      >
        <Modal.Content>
              <BodyLong>
                {modalMessage}
              </BodyLong>
        </Modal.Content>
      </Modal>
    </main>
  )
}
