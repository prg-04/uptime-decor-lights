import Image from 'next/image'
import { cn } from '@/lib/utils'
import signInImg from '@/public/signin-img.jpg'
import signUpImg from '@/public/signup-img.jpg'

export const AuthImageSection = ({ isSignIn }: { isSignIn: boolean }) => (
  <div
    className={cn(
      'relative w-full md:w-1/2 h-64 md:h-auto',
      isSignIn ? 'rounded-tr-2xl rounded-br-2xl' : 'rounded-tl-2xl rounded-bl-2xl',
    )}
  >
    <Image
      src={isSignIn ? signInImg : signUpImg}
      alt={isSignIn ? 'Sign in' : 'Sign up'}
      fill
      className="object-cover"
    />
  </div>
)
