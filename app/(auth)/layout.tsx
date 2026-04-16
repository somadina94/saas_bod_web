export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background via-background to-primary/10 relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-br px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #1098ad 0, transparent 50%), radial-gradient(circle at 70% 80%, #c45c26 0, transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
