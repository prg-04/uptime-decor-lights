'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import logo from '@/public/uptime.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Search, ShoppingCart, UserRound } from 'lucide-react'

interface SubLink {
  title: string
  href: string
}

interface Link {
  title: string
  href: string
  subLinks?: SubLink[]
}

const links: Link[] = [
  {
    title: 'Chandeliers',
    href: '/chandeliers',
    subLinks: [
      { title: 'Low ceiling', href: '/low-ceiling' },
      { title: 'Pendant Lights(3 in 1)', href: '/pendant-lights-3-in-1' },
    ],
  },
  {
    title: 'Wall Lights',
    href: '/wall-lights',
    subLinks: [
      { title: 'Indoor Lights', href: '/indoor-lights' },
      { title: 'Outdoor Lights', href: '/outdoor-lights' },
    ],
  },
  {
    title: 'Switches & Sockets',
    href: '/switches-sockets',
  },
  {
    title: 'Blogs',
    href: '/blogs',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

const icons = [
  { name: 'Home', icon: Search },
  { name: 'User', icon: UserRound },
  { name: 'ShoppingCart', icon: ShoppingCart },
]

interface IconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  className?: string
}

const Icon = ({ icon: IconComponent, className }: IconProps) => {
  return <IconComponent className={cn('h-5 w-5', className)} aria-hidden="true" />
}
const Header = () => {
  return (
    <NavigationMenu className="min-w-full px-6 fixed top-0 z-50 bg-white/30 backdrop-blur-md border-b border-b-gray-600/20">
      <div className="flex items-center justify-between min-w-full">
        <div className="">
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={120}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="">
          <NavigationMenuList className="flex items-center ">
            {links.map((link) => (
              <NavigationMenuItem key={link.title}>
                {link?.subLinks ? (
                  <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                ) : (
                  <Link
                    href={link.href}
                    className="flex h-full w-full select-none flex-col no-underline"
                  >
                    <Button className={`text-primary shadow-none ${navigationMenuTriggerStyle()}`}>
                      {link.title}
                    </Button>
                  </Link>
                )}
                {link?.subLinks && (
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {link?.subLinks?.map((subLink) => (
                        <li key={subLink.title} className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              href={subLink.href}
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            >
                              {subLink.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </div>
        <ul className="flex items-center justify-between gap-6">
          {icons.map(({ name, icon }) => (
            <li key={name}>
              <Icon icon={icon} className="cursor-pointer" />
            </li>
          ))}
        </ul>
      </div>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'

export default Header
