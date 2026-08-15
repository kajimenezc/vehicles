import { useState } from 'react'

type FormData = {
  brand: string
  model: string
  state: 'disponible' | 'no_disponible'
}

type Props = {
  initial?: Partial<FormData>
  onSubmit: (data: FormData) => void
  onCancel: () => void
  title: string
}

export default function VehicleForm({ initial, onSubmit, onCancel, title }: Props) {
  const [form, setForm] = useState<FormData>({
    brand: initial?.brand ?? '',
    model: initial?.model ?? '',
    state: initial?.state ?? 'disponible',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <section className="management-form">
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Marca
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Ej: Toyota"
              required
            />
          </label>
          <label>
            Modelo
            <input
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Ej: Corolla"
              required
            />
          </label>
          <label>
            Estado
            <select
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value as FormData['state'] })}
            >
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No disponible</option>
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary">Guardar</button>
          <button type="button" className="button button-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </section>
  )
}
