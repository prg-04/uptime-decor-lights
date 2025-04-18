// app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Uptime Decor Lights",
  description: "Modern interior lighting and decor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="studio-layout">{children}</div>;
}
