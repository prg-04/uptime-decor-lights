import React, { FC, ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in')
    return null
  }

  return <>{children}</>
}

export default Layout
