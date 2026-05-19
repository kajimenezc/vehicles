export type Vehicle = {
  id: number
  brand: string
  model: string
  state: 'disponible' | 'no_disponible'
  create_date: string
  date_return?: string | null
}

export type RentalRequest = {
  vehicleId: number
  customerName: string
  startDate: string
  expectedReturnDate: string
}

export type RentalResponse = {
  success: boolean
  message: string
  operationId?: number
  vehicle?: Vehicle
}
