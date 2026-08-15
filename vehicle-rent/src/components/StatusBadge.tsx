type Props = {
  state: 'disponible' | 'no_disponible'
}

export default function StatusBadge({ state }: Props) {
  return (
    <span className={`status-pill ${state}`}>
      {state === 'disponible' ? 'Disponible' : 'No disponible'}
    </span>
  )
}
