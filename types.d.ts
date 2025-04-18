interface SignupResponse {
  success: boolean;
  error?: string;
}

interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LogoutResponse {
  success: boolean;
  error?: string;
}

type Result = {
  exp?: number;
  token?: string;
  user?: Customer;
};

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: Customer;
  error?: string;
}

import { StaticImageData } from "next/image";
import { Product } from "./sanity.types";

export interface CarouselItem {
  id: number;
  imageUrl_1: StaticImageData;
  imageUrl_2: StaticImageData;
  title: string;
  description: string;
}

export interface HeroContentProps {
  type: "On Sale" | "Best Seller" | "New Arrival";
  id: number;
  imageUrl_1: StaticImageData | string;
  imageUrl_2?: StaticImageData | string;
  imageUrl_3?: StaticImageData | string;
  title: string;
  subtitle_1: string;
  subtitle_2?: string;
  subtitle_3?: string;
  description?: string;
  additionalInfo?: string;
  promo_code?: string;
}

export interface CarouselProps {
  items: HeroContentProps[];
  autoPlayInterval?: number;
}

interface categoriesHomeProps {
  title: string;
  href: string;
  image: string | StaticImageData;
}


interface CatSecLayoutProps {
  title: string;
  salesCategory: string;
}

interface FooterNavItem {
  title: string;
  icon?: string;
  text?: string;
  subText?: string;
  services?: {
    href?: string;
    icon?: string;
    text?: string;
    subText?: string;
    title?: string;
  }[];
  links?: {
    title: string;
    href: string;
  }[];
}

interface FooterNavServiceItem {
  href?: string;
  icon?: string;
  text?: string;
  subText?: string;
  title?: string;
}

interface FooterNavItem {
  title: string;
  icon?: string;
  text?: string;
  subText?: string;
  services?: FooterNavServiceItem[];
  links?: {
    title: string;
    href: string;
  }[];
}

interface ShippingInfoProps {
  title: string;
  image: string | StaticImageData;
}

interface ProductsPageProps {
  title: string;
  description: string;
  hero_image: string | StaticImageData;
  products: Product[];
}


