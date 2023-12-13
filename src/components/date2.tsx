import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export function Date2({
  date
}: {
  date: {
    from: string
    to: string
  }
}) {
  function formatDateTime(inputStr: string, locale: string = 'en-US'): string {
    const dateObject = new Date(inputStr)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
    const formattedStr = dateObject.toLocaleString('en-IN', options)

    return formattedStr
  }
  return (
    <Button
      id='date'
      variant={'outline'}
      className={cn(
        'w-fit justify-start text-left font-normal text-xs cursor-default',
        !date && 'text-muted-foreground'
      )}
    >
      <CalendarIcon className='mr-2 h-4 w-4' />
      {date?.from ? (
        date.to ? (
          <>
            {date.from} - {date.to}
          </>
        ) : (
          date.from
        )
      ) : (
        <span>Pick a date</span>
      )}
    </Button>
  )
}
