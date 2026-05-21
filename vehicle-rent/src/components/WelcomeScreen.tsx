import type { MouseEventHandler } from 'react'

type Props = {
  onStart: MouseEventHandler<HTMLButtonElement>
  onManage: MouseEventHandler<HTMLButtonElement>
}

export default function WelcomeScreen({ onStart, onManage }: Props) {
  return (
    <main className="hero-screen">
      <div className="hero-panel">
        <span className="badge">Bienvenido a ¡Alquila tu vehiculo!</span>
        <h1>Alquila tu vehículo ideal en segundos</h1>
        <p>
          Accede a la lista de autos disponibles, revisa detalles de cada vehículo y registra
          solicitudes de alquiler fácilmente.
        </p>
        <div className="hero-actions">
          <button onClick={onStart} className="button button-primary">
            Ver vehículos disponibles
          </button>
          <button onClick={onManage} className="button button-secondary">
            Administrar vehículos
          </button>
        </div>
      </div>
    </main>
  )
}
