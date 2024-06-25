import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header>Auth header </header>
      <Link className="hover:underline" href={"/"}>
        Back to home
      </Link>
      {children}
      <footer>auth footer</footer>
    </main>
  );
}
