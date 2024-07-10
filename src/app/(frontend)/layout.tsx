import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen w-full  flex flex-col">
      <Header />
      <div className="w-full   overflow-y-scroll">
        <div className="w-full min-h-screen">{children}</div>
        <footer className="w-full flex justify-center h-8 items-center bg-gray-300">
          Frontend footer
        </footer>
      </div>
    </main>
  );
}
