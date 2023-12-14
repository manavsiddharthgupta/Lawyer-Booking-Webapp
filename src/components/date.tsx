import { CalendarIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export function Date1({
  date
}: {
  date:
    | {
        from: string
        to: string
      }
    | undefined
}) {
  return (
    <div
      id='date1'
      className={cn(
        'w-fit justify-start text-left text-xs flex rounded-md gap-2 font-medium items-center',
        !date && 'text-muted-foreground'
      )}
    >
      <CalendarIcon size={19} />
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
    </div>
  )
}
