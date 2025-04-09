'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { handleAuthSubmit } from '@/lib/authHandler'
import FormField from './FormField'
import { AuthImageSection } from './AuthImageSection'
import { AuthHeader } from './AuthHeader'
import { getAuthFormSchema, AuthFormData, FormType } from '@/schemas/authSchema'
import Link from 'next/link'

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === 'sign-in'
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect') || '/')
  const [loading, setLoading] = useState(false)

  const schema = getAuthFormSchema(type)
  const form = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  return (
    <div
      className={cn(
        'flex w-full max-w-6xl min-h-[80vh] lg:min-h-[800px] shadow-2xl shadow-gray-900 overflow-hidden rounded-2xl',
        isSignIn ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <AuthImageSection isSignIn={isSignIn} />

      <div
        className={cn(
          'flex flex-col justify-center w-full md:w-1/2 p-8 sm:p-10',
          isSignIn ? 'rounded-tl-2xl rounded-bl-2xl' : 'rounded-tr-2xl rounded-br-2xl',
        )}
      >
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <AuthHeader isSignIn={isSignIn} />

          <Form {...form}>
            <form
              onSubmit={(e) =>
                handleAuthSubmit(type, e, redirect.current || '/', router, setLoading)
              }
              className="space-y-4"
            >
              {!isSignIn && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                    type="text"
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Smith"
                    type="text"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Your email address"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button className="w-full" type="submit" disabled={loading}>
                {loading
                  ? isSignIn
                    ? 'Signing in...'
                    : 'Creating account...'
                  : isSignIn
                    ? 'Sign In'
                    : 'Create an Account'}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm">
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
            <Link
              href={!isSignIn ? '/sign-in' : '/sign-up'}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? 'Sign In' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
