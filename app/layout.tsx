import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AmbientBackground from "@/components/AmbientBackground";

const archivoBlack = Archivo_Black({
  weight: '400',
  variable: "--font-archivo-black",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SYUTA. | Premium Streetwear",
  description: "A modern, high-performance streetwear e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-transparent">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col min-h-full flex-grow">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
