import { useEffect } from 'react';
import { register } from './serviceWorkerRegistration';

export default function Home() {
  useEffect(() => {
    register();
  }, []);

  // ... rest of your component
} 