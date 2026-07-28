import Link from "next/link";

const footerLinks = [
  { href: "/modules/mental-model", label: "Preview" },
  { href: "/workshops", label: "Workshops" },
  { href: "#contact", label: "Contact" },
] as const;

export function HomeFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-heading text-xl tracking-tight">LLM Leverage</p>
        <nav aria-label="Marketing footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-background/70 transition-colors hover:text-background focus-visible:text-background"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
