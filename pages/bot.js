import { month } from '@/lib/helper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useToasts } from '@geist-ui/react'
import { useSession } from 'next-auth/react'
import { useSpeechSynthesis } from 'react-speech-kit'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Dictaphone = () => {
  const router = useRouter()
  const [_, setToast] = useToasts()
  const { speak } = useSpeechSynthesis()
  const [message, setMessage] = useState('')
  const { data: userData, status } = useSession()
  const [cards, setCards] = useState([])

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

  const commands = [
    {
      command: 'Shutdown',
      callback: ({ resetTranscript }) => {
        speak({ text: 'Thank you. Hope I eased your tasks today.' })
        resetTranscript()
      },
    },
    {
      command: 'Show My Calendar',
      callback: () => router.push('/calendar'),
    },
    {
      command: ['Tell all my task due today', 'Tell all my tasks due today', 'Tell me the number of task due today', 'Tell me the number of tasks due today'],
      callback: () => {
        if (status === 'authenticated') {
          fetch(`/api/acitivity?userEmail=${userData.user.email}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.hasOwnProperty('Cards')) {
                speak({ text: `You have ${res['Cards'].length} tasks due today.` })
                setMessage('Total Number of Tasks are:', res['Cards'].length)
                speak({ text: `Let's go over each of them.` })
                res['Cards'].forEach((i, _ind) => {
                  let date = new Date(`${i.date} ${i.time}`)
                  speak({ text: `Task ${_ind + 1}: ${i.title || 'No Title'} due on ${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` })
                })
              } else {
                setMessage('Failed to load all your tasks.')
              }
            })
            .catch((e) => {
              setMessage('Failed to load all your tasks.')
            })
        } else {
          setMessage('You need to log in to view tasks.')
        }
      },
    },
    {
      command: 'create a todo',
      callback: () => {
        router.push({
          pathname: '/task/create',
          query: { category: 'To Do' },
        })
      },
    },
    {
      command: 'create a meeting',
      callback: () => {
        router.push({
          pathname: '/task/create',
          query: { category: 'Meetings' },
        })
      },
    },
    {
      command: 'create a deadline',
      callback: () => {
        router.push({
          pathname: '/task/create',
          query: { category: 'Deadlines' },
        })
      },
    },
    {
      command: 'Tell my meeting schedule',
      callback: () => {
        let meetingsCard = cards.filter((i) => i.category === 'Meetings')
        if (meetingsCard.length > 0) {
          speak({ text: `Let's go over each of them.` })
          speak({ text: `You have received ${meetingsCard.length} more meeting${meetingsCard.length > 1 ? 's' : ''} due today.` })
          meetingsCard.forEach((i) => {
            let date = new Date(`${i.date} ${i.time}`)
            speak({ text: `You've a meeting at ${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` })
          })
        } else {
          speak({ text: `You have no meetings scheduled.` })
        }
      },
    },
    {
      command: 'Any updates',
      callback: () => {
        if (status === 'authenticated') {
          fetch(`/api/acitivity?userEmail=${userData.user.email}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.hasOwnProperty('Cards')) {
                let cardDict = { remainingTasks: [] }
                cards.forEach((i) => {
                  cardDict[i.createdAt] = 1
                })

                let newSetCards = res['Cards']
                newSetCards.forEach((i) => {
                  if (cardDict.hasOwnProperty(i.createdAt)) {
                    delete cardDict[i.createdAt]
                  } else {
                    cardDict.remainingTasks.push(i)
                  }
                })

                speak({ text: `You have received ${cardDict['remainingTasks'].length} more task${cardDict['remainingTasks'].length > 1 ? 's' : ''} due today.` })

                if (cardDict['remainingTasks'].length > 0) {
                  speak({ text: `Let's go over each of them.` })
                  cardDict['remainingTasks'].forEach((i, _ind) => {
                    let date = new Date(`${i.date} ${i.time}`)
                    speak({ text: `Task ${_ind + 1}: ${i.title || 'No Title'} due on ${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` })
                  })
                }
              } else {
                setMessage('Failed to load all your tasks.')
              }
            })
            .catch((e) => {
              setMessage('Failed to load all your tasks.')
            })
        }
      },
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript(),
    },
  ]

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands })

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <div className="flex flex-row items-center space-x-5">
        <h1 className="mt-[1.3rem] pb-0.5 pl-5 text-xl font-semibold text-white md:pb-2.5 md:text-3xl">Your Voice Assistant</h1>
      </div>
      <div className="flex h-full flex-col items-start overflow-y-hidden overflow-x-scroll border-t border-[#a0a0a050] p-5">
        <div className="flex flex-col items-start">
          <img src={`/icons/voice-${listening ? 'start' : 'stop'}.svg`} width="25px" />
          <p className="text-xs text-white/80">
            Transcript: <b className="text-white">{transcript}</b>
          </p>
          <div className="mt-3 flex flex-row items-center gap-x-2">
            <button className={listening ? 'shadow-lg' : ''} onClick={SpeechRecognition.startListening}>
              <img className={listening ? 'shadow-lg' : ''} src={`/icons/voice-play.svg`} width="27px" />
            </button>
            <button onClick={SpeechRecognition.stopListening}>
              <img src={`/icons/voice-pause.svg`} width="27px" />
            </button>
            <button className={!listening ? 'shadow-lg' : ''} onClick={resetTranscript}>
              <img className={!listening ? 'shadow-lg' : ''} src={`/icons/voice-reset.svg`} width="27px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dictaphone
