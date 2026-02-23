import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
