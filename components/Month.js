import Day from './Day'
import { Fragment } from 'react'

export default function Month({ cards, month }) {
  return (
    <div className="grid h-full flex-1 grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, idx) => (
            <Day filteredEvents={cards} day={day} key={idx} rowIdx={i} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
