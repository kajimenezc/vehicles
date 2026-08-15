import type { Vehicle } from '../types'
import VehicleRow from './VehicleRow'

type Props = {
  vehicles: Vehicle[]
  loading: boolean
  onRent: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onRefresh: () => void
}

export default function VehicleTable({ vehicles, loading, onRent, onEdit }: Props) {
  return (
    <section className="table-panel">
      <div className="table-panel-header">
        <div>
          <h3>Tabla de vehículos</h3>
        </div>
      </div>

      <div className="table-container">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  {loading ? 'Cargando vehículos...' : 'No hay vehículos disponibles en este momento.'}
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  onRent={onRent}
                  onEdit={onEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
