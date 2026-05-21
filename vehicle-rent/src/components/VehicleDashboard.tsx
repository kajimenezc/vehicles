import { useEffect, useMemo, useState } from 'react'
import type { Vehicle } from '../types'
import { getVehicles, updateVehicle } from '../services/api'

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`
}

export default function VehicleDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [rentingVehicle, setRentingVehicle] = useState<Vehicle | null>(null)
  const [returnDate, setReturnDate] = useState('')

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

  function handleShowRentForm(vehicle: Vehicle) {
    if (vehicle.state !== 'disponible') {
      setMessage('El vehículo ya no está disponible.')
      return
    }
    setRentingVehicle(vehicle)
    setReturnDate('')
    setMessage('')
  }

  const dateOptions = useMemo(() => {
    const options: { label: string; value: string }[] = []
    const today = new Date()
    for (let i = 1; i <= 50; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      options.push({
        label: `${day}/${month}/${year}`,
        value: d.toISOString().slice(0, 10),
      })
    }
    return options
  }, [])

  async function handleConfirmRent(e: React.FormEvent) {
    e.preventDefault()
    if (!rentingVehicle || !returnDate) return

    setLoading(true)
    setMessage('Registrando alquiler...')
    try {
      const updated = await updateVehicle(rentingVehicle.id, {
        brand: rentingVehicle.brand,
        model: rentingVehicle.model,
        state: 'no_disponible',
        dateReturn: new Date(returnDate).toISOString(),
      })
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      setMessage(`Vehículo alquilado exitosamente. Devolución: ${formatDate(returnDate)}`)
      setRentingVehicle(null)
      setReturnDate('')
    } catch (error) {
      setMessage(`Error al alquilar: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelRent(vehicle: Vehicle) {
    setLoading(true)
    setMessage('Cancelando alquiler...')
    try {
      const updated = await updateVehicle(vehicle.id, {
        brand: vehicle.brand,
        model: vehicle.model,
        state: 'disponible',
        dateReturn: null,
      })
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      setMessage('Alquiler cancelado, vehículo disponible nuevamente.')
    } catch (error) {
      setMessage(`Error al cancelar: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <h2>Gestiona tu alquiler</h2>
          <p className="dashboard-subtitle">
            Puedes ver aquí los vehículos disponibles, editar su información
          </p>
        </div>
      </section>

      {rentingVehicle && (
        <form className="management-form" onSubmit={handleConfirmRent}>
          <h3>Alquilar: {rentingVehicle.brand} {rentingVehicle.model}</h3>
          <div className="form-grid">
            <label>
              Fecha de devolución
              <select
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              >
                <option value="" disabled>Seleccione una fecha</option>
                {dateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>
              Confirmar alquiler
            </button>
            <button type="button" className="button button-secondary" onClick={() => setRentingVehicle(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <section className="cards-row">
        <article className="card">
          <h3>Vehículos disponibles</h3>
          <p>
            <strong>{availableCount}</strong> vehículos listos para alquilar.
          </p>
        </article>
      </section>

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
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.brand}</td>
                    <td>{vehicle.model}</td>
                    <td>
                      <span className={`status-pill ${vehicle.state}`}>
                        {vehicle.state === 'disponible' ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td>{formatDate(vehicle.createDate)}</td>
                    <td>{formatDate(vehicle.dateReturn)}</td>
                    <td className="actions-cell">
                      {vehicle.state === 'disponible' ? (
                        <button className="small-button button-primary" onClick={() => handleShowRentForm(vehicle)}>
                          Alquilar
                        </button>
                      ) : (
                        <button className="small-button button-secondary" onClick={() => handleCancelRent(vehicle)}>
                          Cancelar alquiler
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {message ? <div className="message-box">{message}</div> : null}
    </div>
  )
}
