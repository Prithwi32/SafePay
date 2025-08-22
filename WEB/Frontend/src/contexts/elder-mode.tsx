"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ElderModeContextType {
  isElderMode: boolean
  toggleElderMode: () => void
}

const ElderModeContext = createContext<ElderModeContextType | undefined>(undefined)

export function ElderModeProvider({ children }: { children: React.ReactNode }) {
  const [isElderMode, setIsElderMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("elder-mode")
    if (saved) {
      setIsElderMode(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("elder-mode", JSON.stringify(isElderMode))
    if (isElderMode) {
      document.body.classList.add("elder-mode")
    } else {
      document.body.classList.remove("elder-mode")
    }
  }, [isElderMode])

  const toggleElderMode = () => {
    setIsElderMode(!isElderMode)
  }

  return <ElderModeContext.Provider value={{ isElderMode, toggleElderMode }}>{children}</ElderModeContext.Provider>
}

export function useElderMode() {
  const context = useContext(ElderModeContext)
  if (context === undefined) {
    throw new Error("useElderMode must be used within an ElderModeProvider")
  }
  return context
}
