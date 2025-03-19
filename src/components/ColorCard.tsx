"use client"

import type React from "react"
import { useState } from "react"
import { Lock, Unlock, Copy, Check, Eye, EyeOff } from "lucide-react"
import type { ColorData } from "../types"
import { hexToRgb, calculateContrastColor } from "../utils/colorUtils"

interface ColorCardProps {
  color: ColorData
  onToggleLock: () => void
  onUpdateColor: (hex: string) => void
  onCopyColor: () => void
}

const ColorCard: React.FC<ColorCardProps> = ({ color, onToggleLock, onUpdateColor, onCopyColor }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inputValue, setInputValue] = useState(color.hex)
  const [showDetails, setShowDetails] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith("#")) {
      value = "#" + value
    }
    setInputValue(value)
  }

  const handleInputBlur = () => {
    if (/^#[0-9A-F]{6}$/i.test(inputValue)) {
      onUpdateColor(inputValue.toUpperCase())
    } else {
      setInputValue(color.hex)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  const handleCopy = () => {
    onCopyColor()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const contrastTextColor = calculateContrastColor(color.hex)

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="h-40 relative transition-all duration-300 group"
        style={{ backgroundColor: color.hex }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "bg-black/20" : "bg-black/0"
          }`}
        >
          {isHovered && (
            <div className="flex gap-2 animate-fade-in">
              <button
                onClick={onToggleLock}
                className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                style={{ color: color.hex }}
                aria-label={color.locked ? "Unlock color" : "Lock color"}
              >
                {color.locked ? <Lock size={18} /> : <Unlock size={18} />}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                style={{ color: color.hex }}
                aria-label="Copy color"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="text-lg font-mono bg-transparent border-b-2 border-primary-300 dark:border-primary-700 focus:border-primary-500 focus:outline-none px-1 w-28 text-gray-900 dark:text-white"
                maxLength={7}
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-lg font-mono hover:opacity-80 transition-opacity text-gray-900 dark:text-white"
              >
                {color.hex}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {color.locked && <Lock size={16} className="text-gray-500 dark:text-gray-400" />}
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 space-y-2 text-sm font-mono">
            <div className="text-gray-500 dark:text-gray-400">
              RGB: {hexToRgb(color.hex)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Contrast: {contrastTextColor === "#000000" ? "Dark" : "Light"} text recommended
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorCard

