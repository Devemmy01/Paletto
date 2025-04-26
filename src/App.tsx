"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Github, Twitter, RefreshCw, Download, Undo, Redo, Info, } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ColorCard from "./components/ColorCard"
import Header from "./components/Header"
import { generateRandomHex, exportPalette } from "./utils/colorUtils"
import type { ColorData } from "./types"
import logo from "./assets/icon.png"

import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  const [colors, setColors] = useState<ColorData[]>([])
  const [history, setHistory] = useState<ColorData[][]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  // Initialize colors on mount
  useEffect(() => {
    const initialColors = Array(5)
      .fill(null)
      .map((_, index) => {
        const savedColor = localStorage.getItem(`color_${index}`)
        const savedLocked = localStorage.getItem(`color_${index}_locked`) === "true"

        return {
          id: index,
          hex: savedColor || generateRandomHex(),
          locked: savedLocked,
        }
      })

    setColors(initialColors)
    setHistory([initialColors])
    setHistoryIndex(0)
  }, [])

  // Save colors to localStorage whenever they change
  useEffect(() => {
    colors.forEach((color) => {
      localStorage.setItem(`color_${color.id}`, color.hex)
      localStorage.setItem(`color_${color.id}_locked`, String(color.locked))
    })
  }, [colors])

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const generateNewPalette = () => {
    setIsGenerating(true)

    // Add a small delay to show the animation
    setTimeout(() => {
      const newColors = colors.map((color) => ({
        ...color,
        hex: color.locked ? color.hex : generateRandomHex(),
      }))

      setColors(newColors)

      // Add to history if different from current
      if (JSON.stringify(newColors) !== JSON.stringify(colors)) {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newColors)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }

      setIsGenerating(false)
    }, 300)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code.toLowerCase() === "space") {
      e.preventDefault()
      generateNewPalette()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [colors, history, historyIndex])

  const toggleLock = (id: number) => {
    const newColors = colors.map((color) => (color.id === id ? { ...color, locked: !color.locked } : color))
    setColors(newColors)
  }

  const updateColor = (id: number, hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return

    const newColors = colors.map((color) => (color.id === id ? { ...color, hex } : color))

    setColors(newColors)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newColors)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    toast.success(`${hex} copied to clipboard!`, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    })
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setColors(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setColors(history[historyIndex + 1])
    }
  }

  const handleExport = (format: "png" | "json" | "css") => {
    exportPalette(colors, format)
    toast.success(`Palette exported as ${format.toUpperCase()}!`, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Analytics />
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-300 text-sm font-medium">
            Color Palette Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Create stunning color palettes
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Generate harmonious color combinations for your next project. Press space or use the button below to create
            a new palette.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={generateNewPalette}
              disabled={isGenerating}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300 shadow-sm"
            >
              <RefreshCw size={18} className={`mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              Generate New Palette
            </button>

            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                historyIndex <= 0
                  ? "border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              } transition-colors`}
              aria-label="Undo"
            >
              <Undo size={18} />
            </button>

            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                historyIndex >= history.length - 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              } transition-colors`}
              aria-label="Redo"
            >
              <Redo size={18} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                onBlur={() => setTimeout(() => setIsExportOpen(false), 200)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={isExportOpen}
                aria-haspopup="true"
              >
                <Download size={18} className="mr-2" />
                Export
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${isExportOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExportOpen && (
                <div 
                  className="absolute z-10 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 animate-fade-in right-0"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="export-button"
                >
                  <button
                    onClick={() => {
                      handleExport("png")
                      setIsExportOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    role="menuitem"
                  >
                    PNG Image
                  </button>
                  <button
                    onClick={() => {
                      handleExport("css")
                      setIsExportOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    role="menuitem"
                  >
                    CSS Variables
                  </button>
                  <button
                    onClick={() => {
                      handleExport("json")
                      setIsExportOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    role="menuitem"
                  >
                    JSON Format
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {colors.map((color) => (
            <ColorCard
              key={color.id}
              color={color}
              onToggleLock={() => toggleLock(color.id)}
              onUpdateColor={(hex) => updateColor(color.id, hex)}
              onCopyColor={() => copyToClipboard(color.hex)}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Harmonious Combinations</h2>
            
          </div>

          {isInfoOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative">
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Understanding Color Combinations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Complementary Colors</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Colors opposite each other on the color wheel. They create high contrast and visual interest, perfect for creating emphasis and making elements stand out.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analogous Colors</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Colors adjacent to each other on the color wheel. They create a harmonious and cohesive look, ideal for creating a unified design with subtle variations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Triadic Colors</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Three colors evenly spaced on the color wheel. They create a balanced and vibrant color scheme, great for creating dynamic and energetic designs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Complementary", colors: [colors[0]?.hex, colors[2]?.hex] },
              { name: "Analogous", colors: [colors[1]?.hex, colors[2]?.hex, colors[3]?.hex] },
              { name: "Triadic", colors: [colors[0]?.hex, colors[2]?.hex, colors[4]?.hex] },
            ].map((scheme, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{scheme.name}</h3>
                <div className="flex gap-2 mb-3">
                  {scheme.colors.map((hex, idx) => (
                    <div
                      key={idx}
                      className="h-12 flex-1 rounded-md cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: hex }}
                      onClick={() => copyToClipboard(hex || "#FFFFFF")}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {scheme.name === "Complementary" && "Colors opposite each other on the color wheel."}
                  {scheme.name === "Analogous" && "Colors adjacent to each other on the color wheel."}
                  {scheme.name === "Triadic" && "Three colors evenly spaced on the color wheel."}
                </p>
              </div>
            ))}
          </div>
          <button 
              onClick={() => setIsInfoOpen(true)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center mt-4 text-sm font-medium whitespace-nowrap"
            >
              <Info size={16} className="mr-1" />
              Learn more
            </button>
        </div>

        {isHelpOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use Paletto</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Generating Palettes</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Click the "Generate New Palette" button or press the spacebar to create a new color palette. Each color can be locked to keep it while generating new colors for the others.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">History Navigation</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use the undo and redo buttons to navigate through your palette history. This helps you find the perfect combination.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exporting Palettes</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Export your palette in various formats: PNG image, CSS variables, or JSON. Click the export button to see available options.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Color Combinations</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    View different color combinations (Complementary, Analogous, Triadic) below your main palette. Click on any color to copy its hex code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Save your palettes</h2>
            <p className="text-white/80 mb-6">
              Create an account to save your favorite color palettes and access them from anywhere. Share your creations
              with the community.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors">
              Sign up for free
            </button>
          </div>
        </div> */}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 md:justify-center">
                <img src={logo} alt="Paletto" className="w-14 h-14" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400 md:text-center">
                  Paletto
                </span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md md:text-center">
                A modern color palette generator for designers and developers. Create beautiful color schemes for your
                next project.
              </p>
            </div>

            <div className="mt-4">
              <a 
                href="https://www.producthunt.com/posts/paletto-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-paletto&#0045;2" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=958116&theme=light&t=1745702463554" 
                  alt="Paletto - A modern color palette gen for designers and developers | Product Hunt" 
                  style={{ width: '250px', height: '54px' }} 
                  width="250" 
                  height="54" 
                />
              </a>
            </div>

            </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400">
              <span>© 2025 Paletto. All rights reserved.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://github.com/Devemmy01/Paletto"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://x.com/Devemmy25"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  )
}

export default App