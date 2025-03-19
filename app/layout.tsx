import React from 'react'
import InstallPWA from './components/InstallPWA'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Generate and manage beautiful color palettes" />
        
        <link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Color Palette" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Color Palette" />
        
        <title>Color Palette Generator</title>
      </head>
      <body>
        <div id="root">
          {children}
          <InstallPWA />
        </div>
      </body>
    </html>
  )
} 