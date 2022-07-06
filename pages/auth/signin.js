import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, getProviders, useSession } from 'next-auth/react'

const Page = ({ providers }) => {
  const { status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/tasks')
    }
  }, [status])
  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <h1 className="mt-[1.3rem] pb-0.5 pl-5 text-xl font-semibold text-white md:pb-2.5 md:text-3xl">Login</h1>
      <div className="flex h-full flex-row items-start overflow-y-hidden overflow-x-scroll border-t border-[#a0a0a050]">
        {status === 'authenticated' ? (
          <div className="rounded p-5">
            <span className="rounded border px-5 py-3 text-white">You are logged in!</span>
          </div>
        ) : (
          providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} className="p-5">
              <button className="rounded border px-5 py-3 text-white hover:bg-white hover:text-black" onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Page

export async function getServerSideProps() {
  const providers = await getProviders()
  console.log(JSON.stringify(providers))
  return {
    props: {
      providers,
    },
  }
}
