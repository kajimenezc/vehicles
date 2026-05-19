import { useEffect, useMemo, useState } from 'react'
import type { Vehicle } from '../types'
import { getVehicleById, getVehicles, registerRental, updateVehicleState } from '../services/api'

type Props = {
  onNavigate: (page: 'create' | 'edit') => void
}

export default function VehicleDashboard({ onNavigate }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const availableCount = useMemo(
    () => vehicles.filter((vehicle) => vehicle.state === 'disponible').length,
    [vehicles],
  )

  useEffect(() => {
    loadVehicles()
  }, [])

  async function loadVehicles() {
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
  }

  async function handleViewDetails(id: number) {
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
  }

  async function handleRent(vehicle: Vehicle) {
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
  }

  function handleDelete(id: number) {
    setVehicles((previous) => previous.filter((vehicle) => vehicle.id !== id))
    setMessage('Vehículo eliminado de la vista local.')
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Panel principal de rentas</p>
          <h2>Gestiona tu flota y realiza solicitudes</h2>
          <p className="dashboard-subtitle">
            Puedes ver aquí los vehículos disponibles, editar su información y crear nuevas
            secciones con facilidad.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="button" onClick={() => onNavigate('create')}>
            Sección crear vehículo
          </button>
          <button className="button button-secondary" onClick={() => onNavigate('edit')}>
            Sección editar vehículo
          </button>
        </div>
      </section>

      <section className="cards-row">
        <article className="card">
          <h3>Vehículos disponibles</h3>
          <p>
            <strong>{availableCount}</strong> vehículos listos para alquilar y solicitar desde el
            tablero.
          </p>
        </article>
        <article className="card">
          <h3>Estado general</h3>
          <p>
            Las operaciones actualizarán el estado de un vehículo tras el alquiler, cambiando el
            registro a <strong>no disponible</strong>.
          </p>
        </article>
      </section>

      <section className="table-panel">
        <div className="table-panel-header">
          <div>
            <h3>Tabla de vehículos</h3>
            <p>Añade cabeceras, ajusta columnas y conecta con tu microservicio de vehículos.</p>
          </div>
          <button className="button button-primary" onClick={loadVehicles} disabled={loading}>
            Actualizar lista
          </button>
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
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.brand}</td>
                    <td>{vehicle.model}</td>
                    <td>
                      <span className={`status-pill ${vehicle.state}`}>
                        {vehicle.state === 'disponible' ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td>{new Date(vehicle.create_date).toLocaleDateString()}</td>
                    <td>{vehicle.date_return ? new Date(vehicle.date_return).toLocaleDateString() : '—'}</td>
                    <td className="actions-cell">
                      <button className="small-button" onClick={() => handleViewDetails(vehicle.id)}>
                        Ver
                      </button>
                      <button className="small-button button-primary" onClick={() => handleRent(vehicle)}>
                        Alquilar
                      </button>
                      <button className="small-button button-secondary" onClick={() => onNavigate('edit')}>
                        Editar
                      </button>
                      <button className="small-button button-danger" onClick={() => handleDelete(vehicle.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedVehicle ? (
        <section className="detail-panel">
          <h3>Detalle de vehículo</h3>
          <div className="detail-grid">
            <div>
              <strong>ID</strong>
              <p>{selectedVehicle.id}</p>
            </div>
            <div>
              <strong>Marca</strong>
              <p>{selectedVehicle.brand}</p>
            </div>
            <div>
              <strong>Modelo</strong>
              <p>{selectedVehicle.model}</p>
            </div>
            <div>
              <strong>Estado</strong>
              <p>{selectedVehicle.state}</p>
            </div>
            <div>
              <strong>Creado</strong>
              <p>{new Date(selectedVehicle.create_date).toLocaleString()}</p>
            </div>
            <div>
              <strong>Fecha de retorno</strong>
              <p>{selectedVehicle.date_return ?? 'No definida'}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="placeholder-row">
        <article className="placeholder-card">
          <h3>Sección crear vehículo</h3>
          <p>Este espacio está preparado para que agregues el formulario de creación de vehículos.</p>
        </article>
        <article className="placeholder-card">
          <h3>Sección editar vehículo</h3>
          <p>Selecciona un vehículo y luego trabaja en la lógica para editar sus datos.</p>
        </article>
      </section>

      {message ? <div className="message-box">{message}</div> : null}
    </div>
  )
}
