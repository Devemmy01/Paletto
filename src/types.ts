export interface ColorData {
  id: number
  hex: string
  locked: boolean
}

export type PaletteType = "complementary" | "analogous" | "triadic" | "tetradic" | "monochromatic"

export interface PaletteScheme {
  name: string
  colors: string[]
  description: string
}