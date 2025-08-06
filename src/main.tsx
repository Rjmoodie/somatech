import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { testEnvironmentVariables } from './lib/env-test'

// Test environment variables on startup
if (import.meta.env.MODE === 'development') {
  testEnvironmentVariables();
}

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(<App />);
