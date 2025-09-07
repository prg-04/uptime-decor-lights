import { StaticImageData } from "next/image";
import { Product } from "./sanity.types";
import { CartItem } from "./store/store";


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


export interface CarouselItem {
  _id?: string; 
  _key?: string; 
  title: string;
  description: string;
  imageUrl: string; 
  image?: { asset?: { _ref?: string; _type?: string; url?: string } }; 
  ctaText?: string; 
  ctaLink?: string; 
  textColor?: string; 
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
  discount?: string;
  promo_code?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
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

interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

interface GroupedCartItem {
  product: CartItem["product"];
  quantity: number;
}

interface ProductCard {
  title: string;
  image: string | StaticImageData;
  price: string;
}

type HeroSectionBase = {
  type: "first" | "second" | "third";
  title: string;
  subtitle: string;
  cta: {
    label: string;
    href: string;
  };
};

type FirstOrSecondHeroSection = HeroSectionBase & {
  image: string;
  image_2: string;
  image_3: string;
};

type ThirdHeroSection = HeroSectionBase & {
  images: string[];
};

type HeroSection = FirstOrSecondHeroSection | ThirdHeroSection;

export interface N8nProductDetail {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image_url: string | null;
}


export interface N8nPayload {
  order_number: string;
  order_tracking_id: string;
  confirmation_code: string | null;
  payment_status: "paid" | "pending" | "failed";
  amount: number;
  payment_method: string | null;
  created_date: string;
  payment_account: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_location: string;
  clerk_id: string;
  city_town: string;
  products: N8nProductDetail[];
}

interface SlackBlock {
  type: string;
  [key: string]: any;
}

interface SlackMessage {
  blocks: SlackBlock[];
}

export type MessageType = 'order_notification' | 'payment_update' | 'order_shipped';
// types/slack-blocks.ts
export interface SlackText {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
}

export type SlackSection =
  | {
      type: "section";
      text: SlackText;
      accessory?: SlackAccessory;
      fields?: never; // Cannot have fields if text is present
    }
  | {
      type: "section";
      fields: SlackText[];
      text?: never; // Cannot have text if fields are present
      accessory?: SlackAccessory;
    };

export interface SlackHeader {
  type: "header";
  text: SlackText;
}

export interface SlackDivider {
  type: "divider";
}

export interface SlackButton {
  type: "button";
  text: SlackText;
  value?: string;
  url?: string;
  action_id?: string;
  style?: "primary" | "danger";
}

export interface SlackActions {
  type: "actions";
  elements: SlackButton[];
}

export interface SlackAccessory {
  type: "image" | "button";
  image_url?: string;
  alt_text?: string;
  text?: SlackText;
  value?: string;
  action_id?: string;
}

export interface SlackImageBlock {
  type: "image";
  image_url: string;
  alt_text: string;
  title?: SlackText;
}

export type SlackBlock = SlackHeader | SlackSection | SlackDivider | SlackActions | SlackImageBlock;

export interface SlackBlockKit {
  blocks: SlackBlock[];
}

