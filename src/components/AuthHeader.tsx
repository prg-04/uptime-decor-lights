import Image from 'next/image'
import logo from '@/public/uptime.png'

export const AuthHeader = ({ isSignIn }: { isSignIn: boolean }) => (
  <>
    <div className="flex flex-row gap-2 justify-center">
      <Image src={logo} alt="logo" height={60} width={60} />
    </div>
    <h3 className="text-center text-2xl font-semibold">
      {isSignIn ? 'Sign in' : 'Sign up'} to continue
    </h3>
  </>
)
