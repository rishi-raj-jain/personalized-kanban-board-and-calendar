import { useState } from 'react'
import { month } from '@/lib/helper'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useSpeechSynthesis } from 'react-speech-kit'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Dictaphone = () => {
  const router = useRouter()
  const { speak } = useSpeechSynthesis()
  const [message, setMessage] = useState('')
  const { data: userData, status } = useSession()

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
      command: ['Tell me the number of tasks due today'],
      callback: () => {
        if (status === 'authenticated') {
          fetch(`/api/acitivity?userEmail=${userData.user.email}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.hasOwnProperty('Cards')) {
                speak({ text: `You have ${res['Cards'].length} tasks due today.` })
                setMessage('Total Number of Tasks are:', res['Cards'].length)
              } else {
                setMessage('Failed to load all your tasks.')
              }
            })
            .catch((e) => {
              setMessage('Failed to load all your tasks.')
            })
        } else {
          console.log(e)
          setMessage('You need to log in to view tasks.')
        }
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
    },
    {
      command: 'Tell all my tasks due today',
      callback: () => {
        if (status === 'authenticated') {
          fetch(`/api/acitivity?userEmail=${userData.user.email}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.hasOwnProperty('Cards')) {
                res['Cards'].forEach((i, _ind) => {
                  let date = new Date(`${i.date} ${i.time}`)
                  speak({ text: `Task ${_ind+1}: ${i.title || 'No Title'} due on ${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` })
                })
                setMessage('Total Number of Tasks are:', res['Cards'].length)
              } else {
                setMessage('Failed to load all your tasks.')
              }
            })
            .catch((e) => {
              console.log(e)
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
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <p>{message}</p>
    </div>
  )
}

export default Dictaphone
