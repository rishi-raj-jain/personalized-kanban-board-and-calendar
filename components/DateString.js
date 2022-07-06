import { month } from '@/lib/helper'

const DateString = ({ date, className = '' }) => {
  return <span className={className}>{`${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`}</span>
}

export default DateString
