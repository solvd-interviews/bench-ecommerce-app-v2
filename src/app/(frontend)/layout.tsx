import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className="w-full h-20"></div>
      {children}
      <footer>frontend footer</footer>
    </main>
  );
}
