type Props = {
  message: string
  onClear?: () => void
}

export default function MessageAlert({ message, onClear }: Props) {
  if (!message) return null

  return (
    <div className="message-box" onClick={onClear}>
      {message}
    </div>
  )
}
