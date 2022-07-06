import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useToasts } from '@geist-ui/react'
import { useSession } from 'next-auth/react'
import XIcon from '@heroicons/react/outline/XIcon'
import PlusIcon from '@heroicons/react/outline/PlusIcon'

const Page = () => {
  const router = useRouter()
  const [_, setToast] = useToasts()
  const { id, category } = router.query
  const [card, setCard] = useState({})
  const [tasks, setTasks] = useState({})
  const [label, setLabel] = useState({})
  const [title, setTitle] = useState('')
  const [time, setTime] = useState(new Date().toLocaleTimeString().substring(0, 5))
  const [date, setDate] = useState(new Date().toLocaleDateString().split('/').reverse().join('-'))
  const [taskInput, setTaskInput] = useState('')
  const { data: userData, status } = useSession()
  const [labelInput, setLabelInput] = useState('')
  const [description, setDescription] = useState('')
  const [categorySelector, setCategorySelector] = useState('To Do')

  useEffect(() => {
    if (id && id !== 'create')
      fetch(`/api/acitivity?createdAt=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hasOwnProperty('Card')) {
            setCard(res['Card'])
            setToast({
              type: 'success',
              text: 'Your activity has been fetched. Feel free to edit now.',
            })
          } else {
            setToast({
              type: 'secondary',
              text: 'No such card found.',
            })
          }
        })
        .catch((e) => {
          setToast({
            type: 'error',
            text: e,
          })
        })
  }, [id])

  useEffect(() => {
    if (!card) return
    if (card.date) setDate(card.date)
    if (card.time) setTime(card.time)
    if (card.title) setTitle(card.title)
    if (card.description) setDescription(card.description)
    if (card.label && card.label.length > 0) {
      if (card.label.constructor === Array) {
        let temp = card.label
        let dict = {}
        temp.forEach((i) => {
          dict[i] = true
        })
        setLabel(dict)
      } else {
        setLabel({ [card.label]: true })
      }
    }
    if (card.tasks && card.tasks.length > 0) {
      if (card.tasks.constructor === Array) {
        let temp = card.tasks
        let dict = {}
        temp.forEach((i) => {
          dict[i.name] = i.done
        })
        setTasks(dict)
      } else {
        setTasks({ [card.tasks]: false })
      }
    }
    if (card.category) setCategorySelector(card.category)
  }, [card])

  useEffect(() => {
    if (category) {
      setCategorySelector(category)
    }
  }, [category])

  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <h1 className="mt-[1.3rem] pb-0.5 pl-5 text-xl font-semibold text-white md:pb-2.5 md:text-3xl">{card && card['title'] ? `Activity: ${card.title}` : 'Your Activity'}</h1>
      <div className="flex h-full flex-col overflow-y-hidden overflow-x-scroll border-t border-[#a0a0a050] p-5">
        <div className="border-b border-[#FFFFFF50] pb-3">
          <Link href="/tasks">
            <a className="text-[#FFFFFF50]">&larr; Back to Tasks</a>
          </Link>
        </div>
        <div className="mt-5 flex flex-row items-center space-x-3">
          <button
            onClick={(e) => {
              let temp = {
                title,
                date,
                time,
                description,
                label: Object.keys(label)
                  .filter((i) => label[i])
                  .map((i) => i),
                category: categorySelector,
                tasks: Object.keys(tasks).map((i) => ({ name: i, done: tasks[i] })),
              }
              if (card['createdAt']) {
                temp['createdAt'] = card['createdAt']
              }
              if (status === 'authenticated')
                fetch('/api/acitivity', {
                  method: temp['createdAt'] ? 'PUT' : 'POST',
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify({ ...temp, userEmail: userData.user.email }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    setToast({
                      type: 'success',
                      text: `Succesfully ${temp['createdAt'] ? 'updated.' : 'created.'}`,
                    })
                  })
                  .catch((e) => {
                    setToast({
                      type: 'error',
                      text: e,
                    })
                  })
              else {
                setToast({
                  delay: 5000,
                  type: 'error',
                  text: (
                    <div className="flex flex-row items-center space-x-2">
                      <span>{'You need to be authenticated.'}</span>
                      <button
                        className="rounded border p-2"
                        onClick={(e) => {
                          router.push('/api/auth/signin')
                        }}
                      >
                        Sign In
                      </button>
                    </div>
                  ),
                })
              }
            }}
            className="rounded border border-blue-400 bg-transparent px-2 py-1 text-sm text-blue-400"
          >
            {card && card['createdAt'] ? 'Update' : 'Create'}
          </button>
          {card && card.createdAt && (
            <a
              onClick={(e) => {
                e.preventDefault()
                fetch(`/api/acitivity`, {
                  method: 'DELETE',
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify({
                    createdAt: card.createdAt,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    setToast({
                      type: 'success',
                      text: 'Succesfully Deleted. Redirecting to /tasks',
                    })
                    router.push('/tasks')
                  })
                  .catch((e) => {
                    setToast({
                      type: 'error',
                      text: e,
                    })
                  })
              }}
              className="rounded border border-red-400 bg-transparent px-2 py-1 text-sm text-red-400"
            >
              Delete
            </a>
          )}
        </div>
        <span className="mt-5 text-[#FFFFFF50]">Label(s)</span>
        {Object.keys(label).length > 0 && (
          <div className="mt-3 flex flex-row flex-wrap gap-2">
            {Object.keys(label)
              .filter((i) => label[i])
              .map((i) => (
                <div key={i} className="flex cursor-pointer flex-row items-center space-x-2">
                  <span className="rounded border border-[#FFFFFF10] px-3 text-white">{i}</span>
                  <XIcon
                    onClick={(e) => {
                      setLabel((label) => ({ ...label, [i]: !label[i] }))
                    }}
                    className="h-3 w-3 text-[#FFFFFF75]"
                  />
                </div>
              ))}
          </div>
        )}
        <div className="mt-3 flex flex-row items-center space-x-2">
          <PlusIcon
            onClick={(e) => {
              if (labelInput.length > 0) {
                setLabel((label) => ({ ...label, [labelInput]: true }))
                setLabelInput('')
              }
            }}
            className="h-4 w-4 text-[#FFFFFF50] hover:text-white"
          />
          <input
            value={labelInput}
            placeholder="Placeholder Label"
            onChange={(e) => {
              setLabelInput(e.target.value)
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (labelInput.length > 0) {
                  setLabel((label) => ({ ...label, [labelInput]: true }))
                  setLabelInput('')
                }
              }
            }}
            className="rounded border border-[#FFFFFF10] bg-transparent py-2 px-5 text-sm text-white placeholder:text-[#FFFFFF50] hover:border-[#FFFFFF50]"
          />
        </div>
        <input
          type="text"
          value={title}
          placeholder="Placeholder Title"
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          className="mt-5 rounded border border-[#FFFFFF10] bg-transparent py-2 px-5 text-white placeholder:text-[#FFFFFF80] hover:border-[#FFFFFF50]"
        />
        <textarea
          value={description}
          placeholder="Placeholder Description"
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          className="mt-5 rounded border border-[#FFFFFF10] bg-transparent py-2 px-5 text-white placeholder:text-[#FFFFFF80] hover:border-[#FFFFFF50]"
        />
        {date && time && (
          <div className="mt-5 flex flex-row items-center space-x-2 text-[#FFFFFF50]">
            <span>Due on</span>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
              }}
              className="rounded border border-[#FFFFFF50] bg-transparent text-sm text-white"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
              }}
              className="rounded border border-[#FFFFFF50] bg-transparent text-sm text-white"
            />
          </div>
        )}
        <span className="mt-5 text-[#FFFFFF50]">Task(s)</span>
        {Object.keys(tasks).length > 0 && (
          <div className="mt-3 flex flex-col gap-y-3">
            {Object.keys(tasks).map((i) => (
              <div key={i} className="flex flex-row items-center space-x-2">
                <button
                  onClick={(e) => {
                    setTasks((tasks) => ({ ...tasks, [i]: !tasks[i] }))
                  }}
                >
                  <img src={`/icons/checkbox${tasks[i] ? '-checked' : ''}.svg`} className="h-3 w-3" />
                </button>
                <span className="rounded border border-[#FFFFFF50] px-3 text-white">{i}</span>
                <XIcon
                  onClick={(e) => {
                    setTasks((tasks) => {
                      let temp = { ...tasks }
                      delete temp[i]
                      return temp
                    })
                  }}
                  className="h-3 w-3 cursor-pointer text-[#FFFFFF75]"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-row items-center space-x-2">
          <PlusIcon
            onClick={(e) => {
              if (taskInput.length > 0) {
                setTasks((tasks) => ({ ...tasks, [taskInput]: false }))
                setTaskInput('')
              }
            }}
            className="h-4 w-4 text-[#FFFFFF50] hover:text-white"
          />
          <input
            value={taskInput}
            placeholder="Placeholder Task"
            onChange={(e) => {
              setTaskInput(e.target.value)
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (taskInput.length > 0) {
                  setTasks((tasks) => ({ ...tasks, [taskInput]: false }))
                  setTaskInput('')
                }
              }
            }}
            className="rounded border border-[#FFFFFF10] bg-transparent py-2 px-5 text-sm text-white placeholder:text-[#FFFFFF50] hover:border-[#FFFFFF50]"
          />
        </div>
      </div>
    </div>
  )
}

export default Page
