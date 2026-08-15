import { useState, useCallback } from 'react'
import type { Vehicle } from '../types'
import { getVehicleById, getVehicles, registerRental, updateVehicleState } from '../services/api'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadVehicles = useCallback(async () => {
    setLoading(true)
    setMessage('Cargando vehículos...')
    try {
      const list = await getVehicles()
      setVehicles(list)
      setMessage('')
    } catch (error) {
      setMessage(`No se pudo cargar la lista: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const viewDetails = useCallback(async (id: number) => {
    setLoading(true)
    setMessage('Cargando detalles...')
    try {
      const vehicle = await getVehicleById(id)
      setSelectedVehicle(vehicle)
      setMessage('Detalle cargado correctamente.')
    } catch (error) {
      setMessage(`No se pudo obtener el vehículo: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const rentVehicle = useCallback(async (vehicle: Vehicle) => {
    if (vehicle.state !== 'disponible') {
      setMessage('El vehículo ya no está disponible para alquiler.')
      return
    }

    setLoading(true)
    setMessage('Registrando solicitud de alquiler...')
    try {
      await registerRental({
        vehicleId: vehicle.id,
        customerName: 'Cliente demo',
        startDate: new Date().toISOString().slice(0, 10),
        expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      })

      await updateVehicleState(vehicle.id, 'no_disponible')
      setVehicles((previous) =>
        previous.map((item) =>
          item.id === vehicle.id ? { ...item, state: 'no_disponible' } : item,
        ),
      )
      setMessage('Solicitud registrada y estado de vehículo actualizado.')
    } catch (error) {
      setMessage(`Error al solicitar el alquiler: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeVehicle = useCallback((id: number) => {
    setVehicles((previous) => previous.filter((vehicle) => vehicle.id !== id))
    setMessage('Vehículo eliminado de la vista local.')
  }, [])

  const clearMessage = useCallback(() => setMessage(''), [])

  return {
    vehicles,
    selectedVehicle,
    message,
    loading,
    loadVehicles,
    viewDetails,
    rentVehicle,
    removeVehicle,
    clearMessage,
  }
}
