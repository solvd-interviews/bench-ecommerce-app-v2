import SessionProviderComponent from "@/components/SessionProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientProviders from "@/components/ClientProvider";

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
      <body className={inter.className + " bg-secondary"}>
        <SessionProviderComponent>
          <ClientProviders>{children}</ClientProviders>
        </SessionProviderComponent>
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
