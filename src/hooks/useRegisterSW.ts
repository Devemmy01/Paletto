import { useEffect } from 'react'

export function useRegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Wait for the page to load
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration)
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])
} 