'use client'

import { useState, useEffect } from 'react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      console.log('beforeinstallprompt fired')
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Debug PWA requirements
    if (typeof window !== 'undefined') {
      console.log('PWA Debug Info:')
      console.log('- Service Worker supported:', 'serviceWorker' in navigator)
      console.log('- HTTPS:', window.location.protocol === 'https:')
      console.log('- Display mode:', window.matchMedia('(display-mode: standalone)').matches)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if app is already installed
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
      if (evt.matches) {
        console.log('App is installed')
        setIsInstallable(false)
      }
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable) return null

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
    >
      Install App
    </button>
  )
} 