import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <header className="main-header">
      <div>
        <p className="eyebrow">Vehicle Rent</p>
        <h1>
          {location.pathname === '/admin' ? 'Administración de vehículos' : 'Panel principal de alquiler de vehículos'}
        </h1>
      </div>
      <div className="nav-buttons">
        <button className="button" onClick={() => navigate('/dashboard')}>
          Panel de alquiler
        </button>
        <button className="button button-secondary" onClick={() => navigate('/admin')}>
          Administrar vehículos
        </button>
      </div>
    </header>
  )
}
