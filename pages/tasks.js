import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useToasts } from '@geist-ui/react'
import { useSession } from 'next-auth/react'
import KanbanCard from '@/components/KanbanCard'
import PlusSquare from '@heroicons/react/outline/PlusCircleIcon'

const Page = () => {
  const router = useRouter()
  const [_, setToast] = useToasts()
  const [cards, setCards] = useState([])
  const { data: userData, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      setToast({
        delay: 1000,
        type: 'success',
        text: 'You are now logged in.',
      })
      fetch(`/api/acitivity?userEmail=${userData.user.email}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hasOwnProperty('Cards')) {
            console.log(res)
            setCards(res['Cards'])
            setToast({
              type: 'success',
              text: 'Your activities are ready to view.',
            })
          } else {
            setToast({
              type: 'secondary',
              text: res['message'] || 'No cards found.',
            })
          }
        })
        .catch((e) => {
          setToast({
            type: 'error',
            text: e,
          })
        })
    } else {
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
  }, [status])

  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <h1 className="mt-[1.3rem] pb-0.5 pl-5 text-xl font-semibold text-white md:pb-2.5 md:text-3xl">Your Activities</h1>
      <div className="flex h-full flex-row items-start overflow-y-hidden overflow-x-scroll border-t border-[#a0a0a050]">
        <div className="flex h-full w-1/3 min-w-[400px] flex-col p-5">
          <div className="flex flex-col rounded border border-[#a0a0a050] bg-transparent p-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#5fd2ff]"></div>
                <span className="text-xl font-medium text-white">To Do</span>
              </div>
              <Link
                href={{
                  pathname: '/task/create',
                  query: { category: 'To Do' },
                }}
              >
                <a>
                  <PlusSquare color="#5fd2ff" className="h-6 w-6" />
                </a>
              </Link>
            </div>
            <div className="mt-3 h-[2px] w-full bg-[#5fd2ff]"></div>
            <div className="h-full overflow-y-scroll">
              {cards
                .filter((i) => i.createdAt)
                .filter((i) => i.category)
                .filter((i) => i.category === 'To Do')
                .map((i) => (
                  <KanbanCard key={i.createdAt} {...i} />
                ))}
            </div>
          </div>
        </div>
        <div className="flex h-full w-1/3 min-w-[400px] flex-col p-5">
          <div className="flex flex-col rounded border border-[#a0a0a050] p-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#ffae62]"></div>
                <span className="text-xl font-medium text-white">Deadlines</span>
              </div>
              <Link href={{ pathname: '/task/create', query: { category: 'Deadlines' } }}>
                <a>
                  <PlusSquare color="#ffae62" className="h-6 w-6" />
                </a>
              </Link>
            </div>
            <div className="mt-3 h-[2px] w-full bg-[#ffae62]"></div>
            <div className="h-full overflow-y-scroll">
              {cards
                .filter((i) => i.createdAt)
                .filter((i) => i.category)
                .filter((i) => i.category === 'Deadlines')
                .map((i) => (
                  <KanbanCard key={i.createdAt} {...i} />
                ))}
            </div>
          </div>
        </div>
        <div className="flex h-full w-1/3 min-w-[400px] flex-col p-5">
          <div className="flex flex-col rounded border border-[#a0a0a050] p-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#90ffe9]"></div>
                <span className="text-xl font-medium text-white">Meetings</span>
              </div>
              <Link href={{ pathname: '/task/create', query: { category: 'Meetings' } }}>
                <a>
                  <PlusSquare color="#90ffe9" className="h-6 w-6" />
                </a>
              </Link>
            </div>
            <div className="mt-3 h-[2px] w-full bg-[#90ffe9]"></div>
            <div className="h-full overflow-y-scroll">
              {cards
                .filter((i) => i.createdAt)
                .filter((i) => i.category)
                .filter((i) => i.category === 'Meetings')
                .map((i) => (
                  <KanbanCard key={i.createdAt} {...i} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
