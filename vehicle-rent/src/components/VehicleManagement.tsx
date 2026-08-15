import { useEffect, useState } from 'react'
import type { Vehicle } from '../types'
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../services/api'

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [createBrand, setCreateBrand] = useState('')
  const [createModel, setCreateModel] = useState('')
  const [createState, setCreateState] = useState<'disponible' | 'no_disponible'>('disponible')
  const [editBrand, setEditBrand] = useState('')
  const [editModel, setEditModel] = useState('')
  const [editState, setEditState] = useState<'disponible' | 'no_disponible'>('disponible')

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createBrand.trim() || !createModel.trim()) {
      setMessage('Marca y modelo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      const created = await createVehicle({
        brand: createBrand.trim(),
        model: createModel.trim(),
        state: createState,
        dateReturn: null,
      })
      setVehicles((prev) => [...prev, created])
      setMessage('Vehículo creado correctamente.')
      setShowCreate(false)
      setCreateBrand('')
      setCreateModel('')
      setCreateState('disponible')
    } catch (error) {
      setMessage(`Error al crear: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleEditClick(vehicle: Vehicle) {
    setEditingVehicle(vehicle)
    setEditBrand(vehicle.brand)
    setEditModel(vehicle.model)
    setEditState(vehicle.state)
    setMessage('')
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingVehicle) return
    if (!editBrand.trim() || !editModel.trim()) {
      setMessage('Marca y modelo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      const updated = await updateVehicle(editingVehicle.id, {
        brand: editBrand.trim(),
        model: editModel.trim(),
        state: editState,
        dateReturn: null,
      })
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      setMessage('Vehículo actualizado correctamente.')
      setEditingVehicle(null)
    } catch (error) {
      setMessage(`Error al actualizar: ${(error as Error).message}`)
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
          <h2>Gestión de vehículos</h2>
        </div>
        <div className="dashboard-actions">
          <button className="button button-primary" onClick={() => { setShowCreate(true); setEditingVehicle(null) }} disabled={loading}>
            Crear vehículo
          </button>
        </div>
      </div>

      {showCreate && (
        <form className="management-form" onSubmit={handleCreate}>
          <h3>Crear vehículo</h3>
          <div className="form-grid">
            <label>Marca<input type="text" value={createBrand} onChange={(e) => setCreateBrand(e.target.value)} required maxLength={50} /></label>
            <label>Modelo<input type="text" value={createModel} onChange={(e) => setCreateModel(e.target.value)} required maxLength={50} /></label>
            <label>Estado<select value={createState} onChange={(e) => setCreateState(e.target.value as 'disponible' | 'no_disponible')}>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No disponible</option>
            </select></label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>Crear</button>
            <button type="button" className="button button-secondary" onClick={() => setShowCreate(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {editingVehicle && (
        <form className="management-form" onSubmit={handleSaveEdit}>
          <h3>Editar vehículo</h3>
          <div className="form-grid">
            <label>Marca<input type="text" value={editBrand} onChange={(e) => setEditBrand(e.target.value)} required maxLength={50} /></label>
            <label>Modelo<input type="text" value={editModel} onChange={(e) => setEditModel(e.target.value)} required maxLength={50} /></label>
            <label>Estado<select value={editState} onChange={(e) => setEditState(e.target.value as 'disponible' | 'no_disponible')}>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No disponible</option>
            </select></label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>Guardar</button>
            <button type="button" className="button button-secondary" onClick={() => setEditingVehicle(null)}>Cancelar</button>
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
                <td colSpan={6} className="empty-row">
                  {loading ? 'Cargando...' : 'No hay vehículos registrados.'}
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td><span className={`status-pill ${vehicle.state}`}>{vehicle.state === 'disponible' ? 'Disponible' : 'No disponible'}</span></td>
                  <td>{new Date(vehicle.createDate).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="small-button button-secondary" onClick={() => handleEditClick(vehicle)}>Editar</button>
                    <button className="small-button button-danger" onClick={() => handleDelete(vehicle.id)}>Eliminar</button>
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
