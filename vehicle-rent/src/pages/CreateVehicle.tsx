import { useNavigate } from 'react-router-dom'
import VehicleForm from '../components/VehicleForm'

export default function CreateVehicle() {
  const navigate = useNavigate()

  function handleSubmit(data: { brand: string; model: string; state: 'disponible' | 'no_disponible' }) {
    console.log('Crear vehículo:', data)
    navigate('/dashboard')
  }

  return (
    <VehicleForm
      title="Crear nuevo vehículo"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/dashboard')}
    />
  )
}
