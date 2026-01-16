import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import { QueryProvider } from "@/components/Web3Provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
const MontserratLatin = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "CharityX",
  description:
    "Empowering every nonprofit to participate in crypto philanthropy."
}

let locale: "en" | "zh" = "en"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${MontserratLatin.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Toaster position="top-center" />
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
