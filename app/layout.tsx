<<<<<<< HEAD
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { AppWrapper } from "@/components/app-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "Social Hub Pi",
  description: "Social Media platform powered by Pi Network",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.style.fontFamily};
  --font-mono: ${GeistMono.style.fontFamily};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <AppWrapper>{children}</AppWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
=======
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pi Social Hub",
  description: "Professional Pi Network Social Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <head>

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

      </head>

      <body>
        {children}
      </body>

    </html>
  );
}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
