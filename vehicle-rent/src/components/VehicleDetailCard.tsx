import type { Vehicle } from '../types'

type Props = {
  vehicle: Vehicle
}

export default function VehicleDetailCard({ vehicle }: Props) {
  return (
    <section className="detail-panel">
      <h3>Detalle de vehículo</h3>
      <div className="detail-grid">
        <div><strong>ID</strong><p>{vehicle.id}</p></div>
        <div><strong>Marca</strong><p>{vehicle.brand}</p></div>
        <div><strong>Modelo</strong><p>{vehicle.model}</p></div>
        <div><strong>Estado</strong><p>{vehicle.state}</p></div>
        <div><strong>Creado</strong><p>{new Date(vehicle.createDate).toLocaleString()}</p></div>
        <div><strong>Fecha de retorno</strong><p>{vehicle.dateReturn ?? 'No definida'}</p></div>
      </div>
    </section>
  )
}
