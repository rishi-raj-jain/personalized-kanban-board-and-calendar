import Head from 'next/head'
import Link from 'next/link'
import '@/styles/globals.css'
import classNames from 'classnames'
import User from '@/components/User'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { CssBaseline, GeistProvider } from '@geist-ui/react'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter()
  const [sidebar, setSideBar] = useState(0)
  const [media, setMedia] = useState('print')
  const [selectedCategories, setSelectedCategories] = useState({ 'To Do': true, Deadlines: true, Meetings: true })
  const META_TITLE = `Ai Personal digital assistant device`
  const META_DESCRIPTION = 'Your personal digital assistant'
  const META_CANONICAL = process.env.DEPLOYMENT_URL
  const META_FAVICON_IMAGE = `${META_CANONICAL}/assets/icon/favicon-image.png`
  const META_OG_IMAGE = `${META_CANONICAL}/assets/images/loginwithlogo.png`
  useEffect(() => {
    setMedia('all')
  }, [])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url.includes('/tasks')) {
        setSideBar(1)
      } else if (url.includes('/calendar')) {
        setSideBar(2)
      } else {
        setSideBar(0)
      }
    }
    handleRouteChange(router.pathname)
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{META_TITLE}</title>
        <meta name="title" property="title" content={META_TITLE} />
        <meta name="og:title" property="og:title" content={META_TITLE} />
        <meta name="twitter:title" property="twitter:title" content={META_TITLE} />
        <meta name="description" property="description" content={META_DESCRIPTION} />
        <meta name="og:description" property="og:description" content={META_DESCRIPTION} />
        <meta name="twitter:description" property="twitter:description" content={META_DESCRIPTION} />
        {META_CANONICAL && <meta name="og:url" property="og:url" content={META_CANONICAL} />}
        {META_CANONICAL && <meta name="twitter:url" property="twitter:url" content={META_CANONICAL} />}
        <link rel="icon" href={META_FAVICON_IMAGE} />
        <meta name="image" property="og:image" content={META_OG_IMAGE} />
        <meta name="og:image" property="og:image" content={META_OG_IMAGE} />
        <meta name="twitter:image" property="twitter:image" content={META_OG_IMAGE} />
        {META_CANONICAL && <link rel="canonical" href={META_CANONICAL} />}
        <meta property="og:locale" content="en_IN" />
      </Head>
      <GeistProvider>
        <CssBaseline />
        <div className="flex w-screen flex-row items-start overflow-hidden">
          <div className="flex h-screen min-w-[175px] flex-col border-r border-[#a0a0a050] md:min-w-[300px]">
            <img loading="lazy" className="mt-6 h-auto w-[110px] px-5 md:w-[190px]" src="https://www.iiitd.ac.in/sites/default/files/images/logo/style3invertedgreyscalemid.png" />
            <div className="border-b border-[#a0a0a050] py-2"></div>
            <User />
            <Link href="/tasks">
              <a className={classNames('mt-8 flex flex-row space-x-5 px-5', { 'font-bold': sidebar === 1 }, { 'font-light': sidebar !== 1 })}>
                <img loading="lazy" className="h-6 w-6" src="/icons/tasks.svg" />
                <span className="text-white">Tasks</span>
              </a>
            </Link>
            <Link href="/calendar">
              <a className={classNames('mt-8 flex flex-row space-x-5 px-5', { 'font-bold': sidebar === 2 }, { 'font-light': sidebar !== 2 })}>
                <img loading="lazy" className="h-6 w-6 text-white" src="/icons/calendar.svg" />
                <span className="text-white">Calendar</span>
              </a>
            </Link>
            <Link href="/bot">
              <a className={classNames('mt-8 flex flex-row space-x-5 px-5', { 'font-bold': sidebar === 2 }, { 'font-light': sidebar !== 2 })}>
                <img loading="lazy" className="h-6 w-6 text-white" src="/icons/voice.svg" />
                <span className="text-white">Voice Assistant</span>
              </a>
            </Link>
            {sidebar === 2 && (
              <div className="flex flex-col">
                <span className="mt-10 px-5 text-lg text-white">Filter By</span>
                <div className="mt-5 flex flex-col gap-y-5 px-5">
                  {Object.keys(selectedCategories).map((i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        setSelectedCategories({
                          ...selectedCategories,
                          [i]: !selectedCategories[i],
                        })
                      }}
                      className="flex w-[100px] cursor-pointer flex-row items-center space-x-2 rounded border border-[#a0a0a050] p-2 text-center text-white"
                    >
                      <img src={`/icons/checkbox${selectedCategories[i] ? '-checked' : ''}.svg`} className="h-4 w-4" />
                      <span>{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex h-screen w-full flex-col overflow-x-scroll">
            <Component selectedCategories={selectedCategories} {...pageProps} />
          </div>
        </div>
      </GeistProvider>
      <link rel="stylesheet" media={media} href="/fonts/inter-var.woff2" />
    </SessionProvider>
  )
}

export default MyApp
