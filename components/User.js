import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'

const User = () => {
  const router = useRouter()
  const { data: userData, status } = useSession()
  return (
    <div className="mt-6 flex flex-col px-5">
      <div className="flex flex-row items-center space-x-2">
        {status === 'authenticated' && <img className="h-12 w-12 rounded-full" src={userData.user.image} />}
        <button
          className={classNames('rounded border px-5 py-2 text-sm', { 'border border-[#a0a0a050] text-white': true })}
          onClick={(e) => {
            if (status === 'authenticated') return
            router.push('/api/auth/signin')
          }}
        >
          {status === 'authenticated' ? userData.user.email : 'Sign In'}
        </button>
      </div>
      {status === 'authenticated' && (
        <button
          className={classNames('mt-5 rounded border px-5 py-2 text-sm', { 'border border-[#a0a0a050] text-white': true })}
          onClick={(e) => {
            signOut()
          }}
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default User
