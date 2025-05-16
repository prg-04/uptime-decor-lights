import { categoriesHomeProps, FooterNavItem, HeroSection } from "@/types";
import banner from "@/public/lights_lamps_lights_and_lamps_TRADE_Banner.webp";
import new_arrival from "@/public/new_arrival.jpeg";
import pendant_light from "@/public/hero_pr_1.jpeg";
import switchesImg from "@/public/switches&sockets.jpeg";
import chandelier_1 from "@/public/chandelier_1.jpeg";

export const heroSections: HeroSection[] = [
  {
    type: "first",
    title: "Lighting That Feels Like Home",
    subtitle:
      "Soft glows, bold statements, and everything in between — curated for your comfort.",
    cta: { label: "Browse Collections", href: "/best-sellers" },
    image: "/hero_cha_1.jpeg",
    image_2: "/image_1.jpeg",
    image_3: "/Rope_Chandelier.jpeg",
  },
  {
    type: "second",
    title: "Introducing: The Spring/Summer Glow Collection",
    subtitle:
      "Celebrate the season with fresh, airy designs inspired by natural light.",
    cta: { label: "See What's New", href: "/new-arrivals" },
    image: "/banner_pendant.jpeg",
    image_2: "/image_1.jpeg",
    image_3: "/Rope_Chandelier.jpeg",
  },
  {
    type: "third",
    title: "Your Room, Your Rules",
    subtitle:
      "Explore lighting ideas to match your style — minimalist, rustic, modern, or cozy.",
    cta: { label: "Get Inspired", href: "/new-arrivals" },
    images: [
      "/image_1.jpeg",
      "/pendant_4.jpg",
      "/pendant_3.jpg",
      "/pendant_1.jpg",
    ],
  },
];

export const homeBannerContent = {
  image: banner,
  title: "Discover Exquisite Lighting at Uptime Decor Lights",
  description:
    "At Uptime Decor Lights, we offer a curated selection of lighting solutions—from elegant chandeliers and modern pendant lights to versatile wall fixtures and essential switches & sockets. Designed to blend functionality with aesthetic appeal, our collection helps transform any space into something extraordinary. Whether you're renovating, designing from scratch, or searching for the perfect statement piece, Uptime Decor Lights brings inspiration to light. ",
};

export const footerNav: FooterNavItem[] = [
  {
    title: "Company",
    links: [
      {
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        title: "Become an Affiliate",
        href: "/affiliate",
      },
      {
        title: "Privacy Policy",
        href: "/privacy-policy",
      },
    ],
  },

  {
    title: "Help & Support",
    links: [
      {
        title: "Shipping",
        href: "/shipping-information",
      },
      {
        title: "Help Center",
        href: "/help-center",
      },
      {
        title: "FAQ",
        href: "/faq",
      },
    ],
  },

  {
    title: "Customer Service",
    services: [
      {
        href: "",
        icon: "☎️",
        text: "+254 706 969 085",
        subText: "Hours: 10:00 AM - 6:00 PM PST",
      },
      {
        title: "Chat",
        href: "/contact-us",
        icon: "💬",
      },
      {
        title: "Email Support",
        href: "mailto:uptimeelectricals@gmail.com",
        icon: "✉️",
        text: "Response within 24 hours",
      },
    ],
  },
];

export const categoriesHome: categoriesHomeProps[] = [
  {
    title: "New Arrivals",
    href: "/new-arrivals",
    image: new_arrival,
  },
  {
    title: "Chandelier",
    href: "/chandeliers",
    image: chandelier_1,
  },
  {
    title: "Pendants",
    href: "/pendant-lights",
    image: pendant_light,
  },
  {
    title: "Switches & Sockets",
    href: "/switches-and-sockets",
    image: switchesImg,
  },
];
