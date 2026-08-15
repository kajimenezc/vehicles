import { useNavigate } from 'react-router-dom'
import VehicleForm from '../components/VehicleForm'

export default function EditVehicle() {
  const navigate = useNavigate()

  function handleSubmit(data: { brand: string; model: string; state: 'disponible' | 'no_disponible' }) {
    console.log('Editar vehículo:', data)
    navigate('/dashboard')
  }

  return (
    <VehicleForm
      title="Editar vehículo"
      initial={{ brand: '', model: '', state: 'disponible' }}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/dashboard')}
    />
  )
}
