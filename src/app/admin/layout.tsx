import Header from "@/components/Header";
import { config } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ADMIN | Solvd Ecommerce",
  description: "Created by QA & bench full stack team with Next.js 14.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(config);
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return (
    <main className="w-full h-screen flex flex-col">
      <Header isAdmin />
      <div className="flex-grow flex flex-col overflow-hidden bg-secondary">{children}</div>
    </main>
  );
}
