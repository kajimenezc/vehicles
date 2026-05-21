export type Vehicle = {
  id: number
  brand: string
  model: string
  state: 'disponible' | 'no_disponible'
  createDate: string
  dateReturn?: string | null
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
