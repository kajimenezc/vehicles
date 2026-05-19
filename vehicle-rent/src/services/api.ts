import type { RentalRequest, RentalResponse, Vehicle } from '../types'

const VEHICLE_BASE_URL = import.meta.env.VITE_VEHICLE_SERVICE_URL ?? 'http://localhost:4000'
const OPERATION_BASE_URL = import.meta.env.VITE_OPERATION_SERVICE_URL ?? 'http://localhost:5000'

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Error de API: ${response.status} ${response.statusText} - ${body}`)
  }
  return response.json()
}

export async function getVehicles(): Promise<Vehicle[]> {
  return fetchJson<Vehicle[]>(`${VEHICLE_BASE_URL}/vehicles`)
}

export async function getVehicleById(id: number): Promise<Vehicle> {
  return fetchJson<Vehicle>(`${VEHICLE_BASE_URL}/vehicles/${id}`)
}

export async function updateVehicleState(id: number, state: string): Promise<Vehicle> {
  return fetchJson<Vehicle>(`${VEHICLE_BASE_URL}/vehicles/${id}/state`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
}

export async function registerRental(request: RentalRequest): Promise<RentalResponse> {
  return fetchJson<RentalResponse>(`${OPERATION_BASE_URL}/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
}
