interface FooterNavItem {
  title: string
  icon?: string
  text?: string
  subText?: string
  services?: {
    href?: string
    icon?: string
    text?: string
    subText?: string
    title?: string
  }[]
  links?: {
    title: string
    href: string
  }[]
}

interface FooterNavServiceItem {
  href?: string
  icon?: string
  text?: string
  subText?: string
  title?: string
}

interface FooterNavItem {
  title: string
  icon?: string
  text?: string
  subText?: string
  services?: FooterNavServiceItem[]
  links?: {
    title: string
    href: string
  }[]
}