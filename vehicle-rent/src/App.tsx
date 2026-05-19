
import './App.css'
import { useState } from 'react'
import VehicleDashboard from './components/VehicleDashboard'
import WelcomeScreen from './components/WelcomeScreen'

function App() {
  const [page, setPage] = useState<'welcome' | 'dashboard' | 'create' | 'edit'>('welcome')

  function handleStart() {
    setPage('dashboard')
  }

  return (
    <div className="app-shell">
      {page === 'welcome' ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <div className="main-screen">
          <header className="main-header">
            <div>
              <p className="eyebrow">Vehicle Rent</p>
              <h1>Panel principal de alquiler de vehículos</h1>
            </div>
            <div className="nav-buttons">
              <button className="button" onClick={() => setPage('dashboard')}>
                Tabla principal
              </button>
              <button className="button button-secondary" onClick={() => setPage('create')}>
                Crear vehículo
              </button>
              <button className="button button-secondary" onClick={() => setPage('edit')}>
                Editar vehículo
              </button>
            </div>
          </header>

          {page === 'dashboard' ? (
            <VehicleDashboard onNavigate={setPage} />
          ) : page === 'create' ? (
            <section className="placeholder-view">
              <h2>Sección de crear vehículo</h2>
              <p>Aquí podrás agregar el formulario para crear un nuevo vehículo.</p>
              <p>Por ahora este espacio está reservado como placeholder.</p>
            </section>
          ) : (
            <section className="placeholder-view">
              <h2>Sección de editar vehículo</h2>
              <p>Aquí podrás crear la UI para editar la información de un vehículo.</p>
              <p>Selecciona un vehículo desde la tabla para comenzar.</p>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default App
