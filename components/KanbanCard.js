import classNames from 'classnames'
import { useRouter } from 'next/router'
import DateString from '@/components/DateString'
import Check from '@heroicons/react/outline/CheckIcon'

const KanbanCard = ({ createdAt, label, title, tasks, description, category, date, time }) => {
  const router = useRouter()
  /**
   {
    description: 'Something', // String
    title: 'Someone', // String
    tasks: [
      {
        name: 'Hahah', // String
        done: true, // or false
      },
      {
        name: 'Hahah2', // String
        done: false, // or false
      },
    ],
    label: ['some label 1', 'some label 2'] OR 'Some Label' // Array of Strings
    date: '2020-06-06', // YYYY-MM-DD
    time: '15:00', // HH:MM in 24 hr format
    category: 'To Do', // OR Meetings, Deadlines
  }
  **/
  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        router.push({
          pathname: `/task/${createdAt}`,
        })
      }}
      className="mt-5 flex cursor-pointer flex-col rounded bg-white p-2 hover:shadow-lg hover:shadow-cyan-500"
    >
      {label && label.length > 0 && (
        <div className="flex flex-row items-center gap-x-2 overflow-x-scroll text-sm">
          {label.constructor === Array ? (
            label.map((i, _ind) => (
              <span key={_ind} className="rounded bg-gray-200 px-2">
                {i}
              </span>
            ))
          ) : (
            <span className="rounded bg-gray-200 px-2">{label}</span>
          )}
        </div>
      )}
      <span className={classNames('text-lg font-medium', { 'mt-3': label && label.length > 0 })}>{title || 'No Title'}</span>
      <span className={classNames('mt-2 overflow-x-scroll text-sm')}>{description || 'No Description'}</span>
      {((date && time) || (tasks && tasks.length > 0)) && (
        <div className="mt-3 flex flex-row justify-between">
          {date && time && <DateString date={new Date(`${date} ${time}`)} className="rounded bg-gray-100 px-2 text-sm" />}
          {tasks && tasks.length > 0 && tasks.constructor === Array && (
            <div className="flex flex-row items-center space-x-2 rounded bg-gray-100 px-2 text-sm">
              <Check className="h-3 w-3" />
              <span>
                {tasks.filter((i) => i.done).length}/{tasks.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default KanbanCard
