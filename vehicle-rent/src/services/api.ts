import type { RentalRequest, RentalResponse, Vehicle } from '../types'

const VEHICLE_BASE_URL = import.meta.env.VITE_VEHICLE_SERVICE_URL ?? ''
const OPERATION_BASE_URL = import.meta.env.VITE_OPERATION_SERVICE_URL ?? 'http://localhost:5000'
const VEHICLE_API = VEHICLE_BASE_URL
  ? `${VEHICLE_BASE_URL}/api/vehicles`
  : '/api/vehicles'

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Error de API: ${response.status} ${response.statusText} - ${body}`)
  }
  return response.json()
}

export async function getVehicles(): Promise<Vehicle[]> {
  return fetchJson<Vehicle[]>(VEHICLE_API)
}

export async function getVehicleById(id: number): Promise<Vehicle> {
  return fetchJson<Vehicle>(`${VEHICLE_API}/${id}`)
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'createDate'>): Promise<Vehicle> {
  return fetchJson<Vehicle>(VEHICLE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
}

export async function updateVehicle(id: number, vehicle: Omit<Vehicle, 'id' | 'createDate'>): Promise<Vehicle> {
  return fetchJson<Vehicle>(`${VEHICLE_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  })
}

export async function deleteVehicle(id: number): Promise<void> {
  const response = await fetch(`${VEHICLE_API}/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Error de API: ${response.status} ${response.statusText} - ${body}`)
  }
}

export async function updateVehicleState(id: number, state: string): Promise<Vehicle> {
  const current = await getVehicleById(id)
  return fetchJson<Vehicle>(`${VEHICLE_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand: current.brand,
      model: current.model,
      state,
      dateReturn: current.dateReturn,
    }),
  })
}

export async function registerRental(request: RentalRequest): Promise<RentalResponse> {
  return fetchJson<RentalResponse>(`${OPERATION_BASE_URL}/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
}
