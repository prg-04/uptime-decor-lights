'use client'

import { toast } from 'sonner'

import { FormType } from '@/schemas/authSchema'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { signIn, signup } from './actions/auth'

export async function handleAuthSubmit(
  type: FormType,
  event: React.FormEvent<HTMLFormElement>,
  redirect: string,
  router: AppRouterInstance,
  setLoading: (loading: boolean) => void,
) {
  event.preventDefault()
  setLoading(true)

  const formData = new FormData(event.currentTarget)
  const email = formData.get('email')
  const password = formData.get('password')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')

  if ((!email || !password || !firstName || !lastName) && type === 'sign-up') {
    toast.error('Please fill in all fields')
    setLoading(false)
    return
  } else if (!email || !password) {
    toast.error('Please fill in all fields')
    setLoading(false)
    return
  }

  const action = type === 'sign-up' ? signup : signIn
  const payload =
    type === 'sign-up' ? { firstName, lastName, email, password } : { email, password }

  const res = await action(payload as any)

  if (!res.success) {
    toast.error(res.error || `${type === 'sign-up' ? 'Registration' : 'Login'} failed`)
    setLoading(false)
    return
  }

  router.push(redirect)
  setLoading(false)
}
