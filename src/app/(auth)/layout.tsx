export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
