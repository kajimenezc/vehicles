import type { Vehicle } from '../types'
import StatusBadge from './StatusBadge'

type Props = {
  vehicle: Vehicle
  onRent: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
}

export default function VehicleRow({ vehicle, onEdit }: Props) {
  return (
    <tr>
      <td>{vehicle.id}</td>
      <td>{vehicle.brand}</td>
      <td>{vehicle.model}</td>
      <td><StatusBadge state={vehicle.state} /></td>
      <td>{new Date(vehicle.createDate).toLocaleDateString()}</td>
      <td>{vehicle.dateReturn ? new Date(vehicle.dateReturn).toLocaleDateString() : '—'}</td>
      <td className="actions-cell">
        <button className="small-button button-secondary" onClick={() => onEdit(vehicle)}>Editar</button>
      </td>
    </tr>
  )
}
