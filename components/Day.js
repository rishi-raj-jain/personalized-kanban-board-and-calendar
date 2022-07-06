import dayjs from 'dayjs'
import { month } from '@/lib/helper'
import { useState, useEffect } from 'react'
import ExternalLinkIcon from '@heroicons/react/outline/ExternalLinkIcon'

export default function Day({ day, rowIdx, filteredEvents }) {
  const [dayEvents, setDayEvents] = useState([])

  useEffect(() => {
    const events = filteredEvents.filter((evt) => dayjs(evt.date).format('DD-MM-YY') === day.format('DD-MM-YY'))
    setDayEvents(events)
  }, [filteredEvents, day])

  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'bg-cyan-600 px-2 py-1 text-white rounded-full' : ''
  }
  return (
    <div className="flex flex-col items-center border border-[#a0a0a040] shadow-lg">
      <header className="flex flex-col items-center gap-y-2">
        <span className="mt-3 text-sm font-bold text-white">{day.format('ddd')}</span>
        <span className={`text-center text-sm text-gray-200 ${getCurrentDayClass()}`}>
          {day.format('DD')} {month[day.format('M')]}, {day.format('YYYY')}
        </span>
      </header>
      {dayEvents.map((evt, idx) => (
        <div
          onClick={(e) => {
            window.open(`/task/${evt.createdAt}`)
          }}
          key={idx}
          className={`mt-3 flex cursor-pointer flex-row items-center space-x-2 rounded border px-2 py-1 text-center text-sm text-white hover:bg-white hover:text-black`}
        >
          <span className="w-[100px] truncate">Event: {evt.title || 'No Title'}</span>
          <ExternalLinkIcon className="h-3 w-3" />
        </div>
      ))}
    </div>
  )
}
