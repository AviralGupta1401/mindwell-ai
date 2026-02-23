import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "MindWell AI - Your Mental Wellness Companion",
  description: "AI-powered mental health support, mood tracking, and video sessions. Your personal wellness companion.",
  keywords: ["mental health", "AI", "wellness", "mood tracking", "therapy", "support"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
