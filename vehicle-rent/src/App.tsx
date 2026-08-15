import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import VehicleManagement from './components/VehicleManagement'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<VehicleManagement />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
