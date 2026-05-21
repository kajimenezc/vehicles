import { useEffect, useState } from 'react'
import type { Vehicle } from '../types'
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../services/api'

type FormData = {
  brand: string
  model: string
  state: 'disponible' | 'no_disponible'
  dateReturn: string
}

const emptyForm: FormData = { brand: '', model: '', state: 'disponible', dateReturn: '' }

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  useEffect(() => { loadVehicles() }, [])

  async function loadVehicles() {
    setLoading(true)
    setMessage('Cargando vehículos...')
    try {
      const list = await getVehicles()
      setVehicles(list)
      setMessage('')
    } catch (error) {
      setMessage(`Error al cargar: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
  }

  function handleEdit(vehicle: Vehicle) {
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      state: vehicle.state,
      dateReturn: vehicle.dateReturn ?? '',
    })
    setEditingId(vehicle.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.brand.trim() || !form.model.trim()) {
      setMessage('Marca y modelo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        state: form.state
      }
      if (editingId) {
        const updated = await updateVehicle(editingId, payload)
        setVehicles((prev) => prev.map((v) => (v.id === editingId ? updated : v)))
        setMessage('Vehículo actualizado correctamente.')
      } else {
        const created = await createVehicle(payload)
        setVehicles((prev) => [...prev, created])
        setMessage('Vehículo creado correctamente.')
      }
      resetForm()
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este vehículo definitivamente?')) return
    setLoading(true)
    try {
      await deleteVehicle(id)
      setVehicles((prev) => prev.filter((v) => v.id !== id))
      setMessage('Vehículo eliminado.')
    } catch (error) {
      setMessage(`Error al eliminar: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Administración</p>
          <h2>Gestión de vehículos</h2>
        </div>
        <div className="dashboard-actions">
          <button
            className="button button-primary"
            onClick={() => { resetForm(); setShowForm(true) }}
            disabled={loading}
          >
            Crear vehículo
          </button>
        </div>
      </div>

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Editar vehículo' : 'Crear vehículo'}</h3>
          <div className="form-grid">
            <label>
              Marca
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
                maxLength={50}
              />
            </label>
            <label>
              Modelo
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                required
                maxLength={50}
              />
            </label>
            <label>
              Estado
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value as 'disponible' | 'no_disponible' })}
              >
                <option value="disponible">Disponible</option>
                <option value="no_disponible">No disponible</option>
              </select>
            </label>
          
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>
              {editingId ? 'Guardar cambios' : 'Crear'}
            </button>
            <button type="button" className="button button-secondary" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  {loading ? 'Cargando...' : 'No hay vehículos registrados.'}
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
                  <td>{new Date(vehicle.createDate).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="small-button button-secondary" onClick={() => handleEdit(vehicle)}>
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

      {message ? <div className="message-box">{message}</div> : null}
    </div>
  )
}
