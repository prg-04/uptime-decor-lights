'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { headers as getheaders } from 'next/headers'
import configPromise from '@payload-config'
import type { Payload } from 'payload'
import { Customer } from '@/payload-types'
import { LoginParams, LoginResponse, Result, SignUpParams, SignupResponse } from 'types'

async function getUser(): Promise<Customer | null> {
  const headers = await getheaders()
  const payload: Payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  return user || null
}

async function signup({
  firstName,
  lastName,
  email,
  password,
}: SignUpParams): Promise<SignupResponse> {
  const payload = await getPayload({ config })
  try {
    await payload.create({
      collection: 'customers',
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    })
    const result: Result = await payload.login({
      collection: 'customers',
      data: { email, password },
    })
    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
      return { success: true }
    } else {
      return { success: false, error: 'Login failed, please try again' }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

async function signIn({ email, password }: LoginParams): Promise<LoginResponse> {
  const payload = await getPayload({ config })
  try {
    const result: Result = await payload.login({
      collection: 'customers',
      data: { email, password },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })

      return { success: true }
    } else {
      return { success: false, error: 'Login failed, please try again' }
    }
  } catch (error) {
    console.error('Login error', error)
    return { success: false, error: 'Login failed, please try again' }
  }
}

export { signup, signIn, getUser }
