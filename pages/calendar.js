import dayjs from 'dayjs'
import Month from '@/components/Month'
import { getMonth } from '@/lib/helper'
import { useRouter } from 'next/router'
import { useToasts } from '@geist-ui/react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ArrowLeftIcon from '@heroicons/react/outline/ArrowLeftIcon'
import ArrowRightIcon from '@heroicons/react/outline/ArrowRightIcon'

const Page = ({ selectedCategories = [] }) => {
  const router= useRouter()
  const [_, setToast] = useToasts()
  const [cards, setCards] = useState([])
  const [deepCards, setDeepCards] = useState([])
  const { data: userData, status } = useSession()
  const [monthIndex, setMonthIndex] = useState(dayjs().month())
  const [currenMonth, setCurrentMonth] = useState(getMonth(monthIndex))

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex))
  }, [monthIndex])

  useEffect(() => {
    if (status === 'authenticated')
      fetch(`/api/acitivity?userEmail=${userData.user.email}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hasOwnProperty('Cards')) {
            setDeepCards(res['Cards'])
            setCards(res['Cards'].filter((i) => i.category && selectedCategories[i.category]))
            setToast({
              type: 'success',
              text: 'Your calendar is ready to view.',
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
  }, [status])

  useEffect(() => {
    setCards(deepCards.filter((i) => i.category && selectedCategories[i.category]))
  }, [selectedCategories])

  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <div className="flex flex-row items-center space-x-5">
        <h1 className="mt-[1.3rem] pb-0.5 pl-5 text-xl font-semibold text-white md:pb-2.5 md:text-3xl">Your Calendar</h1>
        <div className="flex flex-row items-center space-x-3">
          <ArrowLeftIcon
            onClick={(e) => {
              setMonthIndex((month) => month - 1)
            }}
            className="h-6 w-auto text-white"
          />
          <ArrowRightIcon
            onClick={(e) => {
              setMonthIndex((month) => month + 1)
            }}
            className="h-6 w-auto text-white"
          />
        </div>
      </div>
      <div className="flex h-full flex-row items-start overflow-y-hidden overflow-x-scroll border-t border-[#a0a0a050]">
        <Month cards={cards} month={currenMonth} />
      </div>
    </div>
  )
}

export default Page
