export function isDoctorAvailable(
  appointmentTime: string,
  availableFrom: string,
  availableTo: string
) {
  const appointmentDate = new Date(appointmentTime)
  const availableFromDate = parseTimeString(availableFrom, appointmentTime)
  const availableToDate = parseTimeString(availableTo, appointmentTime)

  return (
    appointmentDate >= availableFromDate && appointmentDate <= availableToDate
  )
}

function parseTimeString(timeString: string, appointmentTime: string) {
  const [time, ampm] = timeString.split(/\s+/)
  const [hours, minutes] = time.split(':')
  const date = new Date(appointmentTime)

  date.setHours(
    ampm === 'AM' ? parseInt(hours) % 12 : (parseInt(hours) % 12) + 12
  )
  date.setMinutes(parseInt(minutes))
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}
