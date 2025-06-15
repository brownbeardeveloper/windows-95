"use client"

import type React from "react"

import { useState } from "react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const Button = ({
    onClick,
    className = "",
    children,
  }: {
    onClick: () => void
    className?: string
    children: React.ReactNode
  }) => (
    <button
      onClick={onClick}
      className={`h-8 bg-gray-300 border-2 border-white border-r-gray-400 border-b-gray-400 hover:bg-gray-200 active:border-gray-400 active:border-r-white active:border-b-white text-sm font-bold ${className}`}
    >
      {children}
    </button>
  )

  return (
    <div className="p-2 bg-gray-300 h-full">
      {/* Display */}
      <div className="mb-2 p-2 bg-white border-2 border-gray-400 border-r-white border-b-white text-right font-mono text-lg">
        {display}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1">
        <Button onClick={clear} className="col-span-2">
          Clear
        </Button>
        <Button onClick={() => inputOperation("÷")}>÷</Button>
        <Button onClick={() => inputOperation("×")}>×</Button>

        <Button onClick={() => inputNumber("7")}>7</Button>
        <Button onClick={() => inputNumber("8")}>8</Button>
        <Button onClick={() => inputNumber("9")}>9</Button>
        <Button onClick={() => inputOperation("-")}>-</Button>

        <Button onClick={() => inputNumber("4")}>4</Button>
        <Button onClick={() => inputNumber("5")}>5</Button>
        <Button onClick={() => inputNumber("6")}>6</Button>
        <Button onClick={() => inputOperation("+")} className="row-span-2">
          +
        </Button>

        <Button onClick={() => inputNumber("1")}>1</Button>
        <Button onClick={() => inputNumber("2")}>2</Button>
        <Button onClick={() => inputNumber("3")}>3</Button>

        <Button onClick={() => inputNumber("0")} className="col-span-2">
          0
        </Button>
        <Button onClick={() => inputNumber(".")}>.</Button>
        <Button onClick={performCalculation}>=</Button>
      </div>
    </div>
  )
}
