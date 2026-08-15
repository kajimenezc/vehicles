import { useEffect, useMemo, useState } from 'react'
import { useVehicles } from '../hooks/useVehicles'
import { updateVehicle } from '../services/api'
import VehicleTable from '../components/VehicleTable'
import MessageAlert from '../components/MessageAlert'
import type { Vehicle } from '../types'

export default function Dashboard() {
  const {
    vehicles,
    message,
    loading,
    loadVehicles,
    rentVehicle,
    clearMessage,
  } = useVehicles()

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [editDateReturn, setEditDateReturn] = useState('')
  const [editState, setEditState] = useState<'disponible' | 'no_disponible'>('disponible')
  const [saving, setSaving] = useState(false)

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

  useEffect(() => { loadVehicles() }, [loadVehicles])

  function handleEditClick(vehicle: Vehicle) {
    setEditingVehicle(vehicle)
    setEditDateReturn(vehicle.dateReturn ?? '')
    setEditState(vehicle.state)
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingVehicle) return
    setSaving(true)
    try {
      await updateVehicle(editingVehicle.id, {
        brand: editingVehicle.brand,
        model: editingVehicle.model,
        state: editState,
        dateReturn: editDateReturn ? new Date(editDateReturn).toISOString() : null,
      })
      loadVehicles()
      setEditingVehicle(null)
      clearMessage()
    } catch (error) {
      console.error('Error al actualizar:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Gestiona tu flota y realiza solicitudes</p>
        </div>
      </section>

      {editingVehicle && (
        <form className="management-form" onSubmit={handleSaveEdit}>
          <h3>Editar: {editingVehicle.brand} {editingVehicle.model}</h3>
          <div className="form-grid">
            <label>Estado<select value={editState} onChange={(e) => setEditState(e.target.value as 'disponible' | 'no_disponible')}>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No disponible</option>
            </select></label>
            <label>Fecha de devolución<select value={editDateReturn} onChange={(e) => setEditDateReturn(e.target.value)}>
              <option value="">Sin definir</option>
              {dateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select></label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={saving}>Guardar</button>
            <button type="button" className="button button-secondary" onClick={() => setEditingVehicle(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        onRent={rentVehicle}
        onEdit={handleEditClick}
        onRefresh={loadVehicles}
      />

      <MessageAlert message={message} onClear={clearMessage} />
    </div>
  )
}
