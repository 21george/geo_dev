import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "George — Freelance Software Developer in Munich",
  description: "Freelance developer in Munich creating responsive websites, web applications and mobile apps for individuals and businesses.",
  icons: {
    icon: [{url:"/geo-dev-logo.png",type:"image/png"}],
    shortcut: "/geo-dev-logo.png",
    apple: "/geo-dev-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
