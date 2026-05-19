import type { MouseEventHandler } from 'react'

type Props = {
  onStart: MouseEventHandler<HTMLButtonElement>
}

export default function WelcomeScreen({ onStart }: Props) {
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
          <button onClick={onStart} className="button button-primary">
            Ver vehículos disponibles
          </button>
        </div>
      </div>
    </main>
  )
}
