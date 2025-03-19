import type { ColorData } from "../types"

// Generate random hex color
export const generateRandomHex = (): string => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Calculate contrasting color for text visibility
export const calculateContrastColor = (hex: string): string => {
  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(1, 3), 16)
  const g = Number.parseInt(hex.substring(3, 5), 16)
  const b = Number.parseInt(hex.substring(5, 7), 16)

  // Calculate perceived brightness using YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return black or white based on brightness
  return yiq >= 128 ? "#000000" : "#FFFFFF"
}

// Export palette in different formats
export const exportPalette = (colors: ColorData[], format: "png" | "json" | "css"): void => {
  switch (format) {
    case "png":
      exportAsPng(colors)
      break
    case "json":
      exportAsJson(colors)
      break
    case "css":
      exportAsCss(colors)
      break
  }
}

const exportAsPng = (colors: ColorData[]): void => {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const width = 1200
  const height = 300
  const colorWidth = width / colors.length

  canvas.width = width
  canvas.height = height

  // Draw each color as a rectangle
  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex
    ctx.fillRect(index * colorWidth, 0, colorWidth, height)

    // Add hex value
    ctx.fillStyle = calculateContrastColor(color.hex)
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(color.hex, index * colorWidth + colorWidth / 2, height / 2 - 15)

    // Add RGB value
    ctx.font = "16px Arial"
    ctx.fillText(hexToRgb(color.hex), index * colorWidth + colorWidth / 2, height / 2 + 15)
  })

  // Add a watermark
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
  ctx.font = "14px Arial"
  ctx.textAlign = "right"
  ctx.fillText("Generated with Paletto", width - 20, height - 20)

  // Convert to data URL and download
  const dataUrl = canvas.toDataURL("image/png")
  const link = document.createElement("a")
  link.download = "palette.png"
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportAsJson = (colors: ColorData[]): void => {
  const data = {
    palette: colors.map((color) => ({
      hex: color.hex,
      rgb: hexToRgb(color.hex),
      locked: color.locked,
    })),
    timestamp: new Date().toISOString(),
    source: "Paletto",
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const link = document.createElement("a")
  link.download = "palette.json"
  link.href = dataUri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportAsCss = (colors: ColorData[]): void => {
  let css = `/* Palette generated by Paletto */\n\n:root {\n`

  // Add color variables
  colors.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color.hex};\n`
    const rgb = hexToRgbArray(color.hex)
    css += `  --color-${index + 1}-rgb: ${rgb.join(", ")};\n`
  })

  // Add semantic variables
  css += `\n  /* Semantic variables */\n`
  css += `  --color-primary: ${colors[0].hex};\n`
  css += `  --color-secondary: ${colors[1].hex};\n`
  css += `  --color-accent: ${colors[2].hex};\n`
  css += `  --color-background: ${colors[3].hex};\n`
  css += `  --color-text: ${calculateContrastColor(colors[3].hex)};\n`

  css += `}\n\n`

  // Add dark mode variables
  css += `/* Dark mode variables */\n`
  css += `.dark-mode {\n`
  css += `  --color-background: ${colors[4].hex};\n`
  css += `  --color-text: ${calculateContrastColor(colors[4].hex)};\n`
  css += `}\n\n`

  // Add utility classes
  css += `/* Utility classes */\n`
  colors.forEach((color, index) => {
    css += `.bg-palette-${index + 1} { background-color: ${color.hex}; }\n`
    css += `.text-palette-${index + 1} { color: ${color.hex}; }\n`
  })

  const dataUri = "data:text/css;charset=utf-8," + encodeURIComponent(css)

  const link = document.createElement("a")
  link.download = "palette.css"
  link.href = dataUri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper functions
export function hexToRgb(hex: string): string {
  const r = Number.parseInt(hex.substring(1, 3), 16)
  const g = Number.parseInt(hex.substring(3, 5), 16)
  const b = Number.parseInt(hex.substring(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function hexToRgbArray(hex: string): number[] {
  const r = Number.parseInt(hex.substring(1, 3), 16)
  const g = Number.parseInt(hex.substring(3, 5), 16)
  const b = Number.parseInt(hex.substring(5, 7), 16)
  return [r, g, b]
}

// Generate a harmonious color palette
export const generateHarmoniousPalette = (
  baseColor: string,
  type: "complementary" | "analogous" | "triadic" | "tetradic" | "monochromatic",
): string[] => {
  // Convert hex to HSL for easier manipulation
  const hsl = hexToHsl(baseColor)
  const palette: string[] = [baseColor]

  switch (type) {
    case "complementary":
      // Add complementary color (opposite on the color wheel)
      palette.push(hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]))
      break
    case "analogous":
      // Add colors adjacent on the color wheel
      palette.push(hslToHex((hsl[0] + 30) % 360, hsl[1], hsl[2]))
      palette.push(hslToHex((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]))
      break
    case "triadic":
      // Add colors evenly spaced on the color wheel
      palette.push(hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]))
      palette.push(hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]))
      break
    case "tetradic":
      // Add colors in a rectangle on the color wheel
      palette.push(hslToHex((hsl[0] + 90) % 360, hsl[1], hsl[2]))
      palette.push(hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]))
      palette.push(hslToHex((hsl[0] + 270) % 360, hsl[1], hsl[2]))
      break
    case "monochromatic":
      // Add variations of the same hue with different lightness
      palette.push(hslToHex(hsl[0], hsl[1], Math.max(hsl[2] - 20, 0)))
      palette.push(hslToHex(hsl[0], hsl[1], Math.min(hsl[2] + 20, 100)))
      break
  }

  return palette
}

// Helper function to convert hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(1, 3), 16) / 255
  const g = Number.parseInt(hex.substring(3, 5), 16) / 255
  const b = Number.parseInt(hex.substring(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h = Math.round(h * 60)
  }

  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return [h, s, l]
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

