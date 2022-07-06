export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const weekday = new Array(7)
weekday[0] = 'Sunday'
weekday[1] = 'Monday'
weekday[2] = 'Tuesday'
weekday[3] = 'Wednesday'
weekday[4] = 'Thursday'
weekday[5] = 'Friday'
weekday[6] = 'Saturday'

export const month = new Array()
month[0] = 'January'
month[1] = 'February'
month[2] = 'March'
month[3] = 'April'
month[4] = 'May'
month[5] = 'June'
month[6] = 'July'
month[7] = 'August'
month[8] = 'September'
month[9] = 'October'
month[10] = 'November'
month[11] = 'December'

export const getStringDate = (dateVal) => {
  var today = new Date(dateVal)
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()
  return `${dd}${mm}${yyyy}`
}

import dayjs from 'dayjs'

export const getMonth = (month = dayjs().month()) => {
  month = Math.floor(month)
  const year = dayjs().year()
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day()
  let currentMonthCount = 0 - firstDayOfTheMonth
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++
      return dayjs(new Date(year, month, currentMonthCount))
    })
  })
  return daysMatrix
}
