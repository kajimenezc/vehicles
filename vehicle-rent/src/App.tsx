
import './App.css'
import { useState } from 'react'
import VehicleDashboard from './components/VehicleDashboard'
import VehicleManagement from './components/VehicleManagement'
import WelcomeScreen from './components/WelcomeScreen'

type Page = 'welcome' | 'dashboard' | 'management' | 'create' | 'edit'

function App() {
  const [page, setPage] = useState<Page>('welcome')

  function handleStart() {
    setPage('dashboard')
  }

  function handleManage() {
    setPage('management')
  }

  return (
    <div className="app-shell">
      {page === 'welcome' ? (
        <WelcomeScreen onStart={handleStart} onManage={handleManage} />
      ) : (
        <div className="main-screen">
          <header className="main-header">
            <div>
              <p className="eyebrow">Vehicle Rent</p>
              <h1>
                {page === 'management'
                  ? 'Administración de vehículos'
                  : 'Panel principal de alquiler de vehículos'}
              </h1>
            </div>
            <div className="nav-buttons">
              <button className="button" onClick={() => setPage('dashboard')}>
                Panel de alquiler
              </button>
              <button className="button button-secondary" onClick={() => setPage('management')}>
                Administrar vehículos
              </button>
            </div>
          </header>

          {page === 'dashboard' ? (
            <VehicleDashboard />
          ) : page === 'management' ? (
            <VehicleManagement />
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
