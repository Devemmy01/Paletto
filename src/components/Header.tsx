"use client"

import type React from "react"
import { Moon, Sun, HelpCircle } from "lucide-react"
import logo from "../assets/icon.png"

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenHelp: () => void
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode, onOpenHelp }) => {
  return (
    <header className="bg-white dark:bg-gray-900">
      <div className="container flex h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Paletto" className="w-14 h-14" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
            Paletto
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
