import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Central",
  description: "Plataforma multi-blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}