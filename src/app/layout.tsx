import SessionProviderComponent from "@/components/SessionProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solvd Ecommerce",
  description: "Created by QA & bench full stack team with Next.js 14.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderComponent>{children}</SessionProviderComponent>{" "}
        <Toaster
          position="top-center"
          expand={false}
          richColors
          closeButton={true}
        />
      </body>
    </html>
  );
}
