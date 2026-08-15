import { useNavigate } from 'react-router-dom'

export default function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <main className="hero-screen">
      <div className="hero-panel">
        <span className="badge">Bienvenido a Vehicle Rent</span>
        <h1>Alquila tu vehículo ideal en segundos</h1>
        <p>
          Accede a la lista de autos disponibles, revisa detalles de cada vehículo y registra
          solicitudes de alquiler fácilmente.
        </p>
        <div className="hero-actions">
          <button onClick={() => navigate('/dashboard')} className="button button-primary">
            Ver vehículos disponibles
          </button>
          <button onClick={() => navigate('/admin')} className="button button-secondary">
            Administrar vehículos
          </button>
        </div>
      </div>
    </main>
  )
}
