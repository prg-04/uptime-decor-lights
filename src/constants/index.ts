import luxe_gold from '@/public/luxe-gold.webp'
import chandelier_1 from '@/public/chandelier_1.jpeg'
import chandelier_2 from '@/public/hero_cha_1.jpeg'
import new_arrival from '@/public/new_arrival.jpeg'
import pendant_light from '@/public/hero_pr_1.jpeg'
import switchesImg from '@/public/switches&sockets.jpeg'
import banner from '@/public/lights_lamps_lights_and_lamps_TRADE_Banner.webp'
import shipping_1 from '@/public/L-L_ICON_ASSET-01.webp'
import shipping_2 from '@/public/L-L_ICON_ASSET-03.webp'
import shipping_3 from '@/public/L-L_ICON_ASSET-05.avif'
import shipping_4 from '@/public/L-L_ICON_ASSET-18.webp'

import { categoriesHomeProps, FooterNavItem, HeroContentProps, ProductCard, ProductsPageProps, ShippingInfoProps } from 'types'

export const heroContent: HeroContentProps[] = [
  {
    type: 'On Sale',
    id: 1,
    imageUrl_1: chandelier_1,
    imageUrl_2: chandelier_2,
    title: 'Crystal Elegance Collection',
    subtitle_1: 'Exclusive Ramadan Offers',
    description: "Don't miss out on our premium selection",
    additionalInfo: 'Up to 50% off',
  },
  {
    type: 'Best Seller',
    id: 2,
    imageUrl_1: luxe_gold,
    title: 'Royal Luxe Collection',
    subtitle_1: 'Premium Crystal Masterpieces',
    description: 'Transform your space with timeless luxury',
    additionalInfo: 'Exclusive discount with code',
    promo_code: 'CODE10-HXVN90',
  },
  {
    type: 'New Arrival',
    id: 3,
    imageUrl_1: new_arrival,
    description: 'Discover our latest collection of exquisite lighting designs',
    title: 'New Arrivals 2024',
    subtitle_1: '',
  },
]

export const categoriesHome: categoriesHomeProps[] = [
  {
    title: 'New Designs',
    href: '/new-designs',
    image: new_arrival,
  },
  {
    title: 'Chandelier',
    href: '/chandelier',
    image: chandelier_1,
  },
  {
    title: 'Pendants',
    href: '/pendants',
    image: pendant_light,
  },
  {
    title: 'Switches & Sockets',
    href: '/switches-sockets',
    image: switchesImg,
  },
]

export const new_arrivals: ProductCard[] = [
  {
    title: 'Aurora - 1 light polished chrome and crystal pendant',
    image: chandelier_2,
    price: '$199',
  },
  {
    title: 'Lumina - 3 light polished chrome and crystal pendant',
    image: luxe_gold,
    price: '$699',
  },
  {
    title: 'Stella - 2 light polished chrome and crystal pendant',
    image: new_arrival,
    price: '$399',
  },
  {
    title: 'Celeste - 4 light polished chrome and crystal pendant',
    image: pendant_light,
    price: '$999',
  },
  {
    title: 'Rhapsody - 5 light polished chrome and crystal pendant',
    image: chandelier_1,
    price: '$1,299',
  },
]

export const bestSellers: ProductCard[] = [
  {
    title: 'Lumina - 3 light polished chrome and crystal pendant',
    image: luxe_gold,
    price: '$699',
  },
  {
    title: 'Celeste - 4 light polished chrome and crystal pendant',
    image: pendant_light,
    price: '$999',
  },
  {
    title: 'Rhapsody - 5 light polished chrome and crystal pendant',
    image: chandelier_1,
    price: '$1,299',
  },
  {
    title: 'Aurora - 1 light polished chrome and crystal pendant',
    image: chandelier_2,
    price: '$199',
  },
  {
    title: 'Stella - 2 light polished chrome and crystal pendant',
    image: new_arrival,
    price: '$399',
  },
]

export const onSale: ProductCard[] = [
  {
    title: 'Aurora - 1 light polished chrome and crystal pendant',
    image: chandelier_2,
    price: '$149',
  },
  {
    title: 'Luna - 3 light polished chrome and crystal pendant',
    image: luxe_gold,
    price: '$499',
  },
  {
    title: 'Stella - 2 light polished chrome and crystal pendant',
    image: new_arrival,
    price: '$249',
  },
  {
    title: 'Nova - 4 light polished chrome and crystal pendant',
    image: pendant_light,
    price: '$699',
  },
  {
    title: 'Aster - 5 light polished chrome and crystal pendant',
    image: chandelier_1,
    price: '$999',
  },
]

export const homeBannerContent = {
  image: banner,
  title: 'Designed in house',
  description:
    "All our products are designed in house by us. We've been designing lighting for the UK and across the U.S. for over 20 years. We use our years of experience, engineering expertise and material knowledge to constantly create new collections and exciting pieces designed and built to last. ",
  description_2:
    'We’re positively obsessed with product design; it’s at the heart of what we do. Our skills and abilities with various materials, be it handwoven rattan to fine polished crystal - allows us to continue to innovate, taking the lighting industry in new directions.',
}

export const homeContent = [
  {
    title: 'Elegant, modern lamps in Kenya',
    description:
      'Are you looking to transform the lighting in your home? Then you have come to the right place. Here at lights&lamps, we have everything you need. From floor-standing lamps to modern table lamps, lighting is our specialty, so you are sure to find something you love in our collections. Transform the ambience of your home with the right lighting. From calming modern bedroom lamps to stunning dining room chandeliers, we are a one-stop shop for your lighting needs. No matter the size, colour and design you’re looking for, we have the perfect style for your space.',
  },
  {
    title: 'Brighten your space with modern table lights',
    description:
      "A home should epitomise the homeowner's personality; so not only is functionality and style important, but character is too. Here at lights&lamps, we offer a comprehensive selection of products that will meet your needs on all counts. Whether you are looking for a table light with a modern design to wind down with and relax in the evenings, a bedroom lamp for some soft lighting as you prepare for bed, wall lights to brighten up your dining space or other, we have you covered. Make a statement with a sophisticated, stand-out lamp or opt for neutral designs and colours to blend with your existing decor. Our unique lamps with modern designs give you great versatility, enabling you to easily bring your vision to life. Shop a single lamp for a single room or choose multiple lamps for a multi-space renovation, achieving a smooth room-to-room flow. With a diverse range of designs available, you can choose materials and colours that match your chosen aesthetic. From wood to brass, marble to glass, ceramic to rattan and so much more, you’re guaranteed to love our selection. Ensure that your choice of lighting gets noticed for the right reasons with lights&lamps.",
  },
  {
    title: 'Covering both domestic and trade needs',
    description:
      'Our modern lights and lamps are available to all; we understand that your project can go beyond a single home renovation and can fulfil both medium and larger-scale project orders. Designing and producing all our products in-house, you can rest assured that you’re choosing quality lights and lamps each and every time. Regardless of whether you are shopping for a single lamp or many, small or large lamps, you can rely on us for quality modern lamps in UK. When you shop our range, you are choosing elegant designs and affordable pricing so you can stay within your budget without compromising on style. And with free and fast delivery available for items that are in stock, the time scales you have set for your renovation can remain on track.',
  },
  {
    title: 'Browse our collections today',
    description:
      'Get started today by browsing our collections online or contacting our friendly team to discuss your needs. Choose stunning, unique lights and lamps that are built to last by shopping our range. If you are looking for elegant pieces that won’t let you down, we have you covered. Embrace your love for modern lighting with lights&lamps today. ',
  },
]

export const footerNav: FooterNavItem[] = [
  {
    title: 'Company',
    links: [
      {
        title: 'About Us',
        href: '/about-us',
      },
      {
        title: 'Contact Us',
        href: '/contact-us',
      },
      {
        title: 'Become an Affiliate',
        href: '/become-an-affiliate',
      },
      {
        title: 'Privacy Policy',
        href: '/privacy-policy',
      },
    ],
  },
  {
    title: 'Resource',
    links: [
      {
        title: 'Chandelier Size Guide',
        href: '/chandelier-size-guide',
      },
      {
        title: 'Chandelier blogs',
        href: '/chandelier-blogs',
      },
      {
        title: 'Customization',
        href: '/customization',
      },
      {
        title: 'Customer Reviews',
        href: '/customer-reviews',
      },
    ],
  },

  {
    title: 'Help & Support',
    links: [
      {
        title: 'Return & Refunds',
        href: '/return-refunds',
      },
      {
        title: 'Shipping',
        href: '/shipping',
      },
      {
        title: 'Help Center',
        href: '/help-center',
      },
      {
        title: 'FAQ',
        href: '/faq',
      },
    ],
  },

  {
    title: 'Customer Service',
    services: [
      {
        href: 'tel:+12068801339',
        icon: '☎️',
        text: '206-880-1339',
        subText: 'Hours: 10:00 AM - 6:00 PM PST',
      },
      {
        title: 'Chat',
        href: '/contact',
        icon: '💬',
      },
      {
        title: 'Email Support',
        href: 'mailto:support@lightsandlamps.com',
        icon: '✉️',
        text: 'Response within 24 hours',
      },
    ],
  },
]

export const shippingInfo: ShippingInfoProps[] = [
  {
    title: 'Free Shipping',
    image: shipping_2,
  },
  {
    title: 'Next day delivery available',
    image: shipping_3,
  },
  {
    title: '28 days return policy',
    image: shipping_1,
  },
  {
    title: '100% recyclable packaging',
    image: shipping_4,
  },
]

export const ChandelierProducts: ProductsPageProps = {
  title: 'Chandelier',
  description:
    "Our ceiling collection has been designed with everyone in mind. Whether it's a statement pendant, a sculptural fitting or a mid-century chandelier; we have curated a range of ceiling lights, big and small, to suit every home, every room and every interior style. Aspirational and affordable, inspiring and inclusive. Click here to browse the collection.",
  hero_image: chandelier_1,
  products: [
    {
      id: 1,
      category: 'Chandelier',
      title: 'Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 100,
      onSale: true,
      new_arrival: true,
      bestSellers: true,
      size: 'small',
    },
    {
      id: 2,
      category: 'Chandelier',
      title: 'Crystal Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 299,
      onSale: false,
      new_arrival: true,
      bestSellers: false,
      size: 'large',
    },
    {
      id: 3,
      category: 'Chandelier',
      title: 'Modern Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 449,
      onSale: true,
      new_arrival: false,
      bestSellers: true,
      size: 'medium',
    },
    {
      id: 4,
      category: 'Chandelier',
      title: 'Vintage Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 379,
      onSale: false,
      new_arrival: false,
      bestSellers: true,
      size: 'large',
    },
    {
      id: 5,
      category: 'Chandelier',
      title: 'Art Deco Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 599,
      onSale: true,
      new_arrival: true,
      bestSellers: false,
      size: 'medium',
    },
    {
      id: 6,
      category: 'Chandelier',
      title: 'Industrial Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 289,
      onSale: false,
      new_arrival: true,
      bestSellers: true,
      size: 'small',
    },
    {
      id: 7,
      category: 'Chandelier',
      title: 'Rustic Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 349,
      onSale: true,
      new_arrival: false,
      bestSellers: false,
      size: 'medium',
    },
    {
      id: 8,
      category: 'Chandelier',
      title: 'Contemporary Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 479,
      onSale: false,
      new_arrival: true,
      bestSellers: true,
      size: 'large',
    },
    {
      id: 9,
      category: 'Chandelier',
      title: 'Minimalist Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 259,
      onSale: true,
      new_arrival: false,
      bestSellers: true,
      size: 'small',
    },
    {
      id: 10,
      category: 'Chandelier',
      title: 'Traditional Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 399,
      onSale: false,
      new_arrival: true,
      bestSellers: false,
      size: 'medium',
    },
    {
      id: 11,
      category: 'Chandelier',
      title: 'Luxury Chandelier',
      images: [chandelier_1, chandelier_2],
      price: 899,
      onSale: true,
      new_arrival: true,
      bestSellers: true,
      size: 'large',
    },
  ],
}
