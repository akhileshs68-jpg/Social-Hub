import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Hub Pi",
  description: "Pi Network Social Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}