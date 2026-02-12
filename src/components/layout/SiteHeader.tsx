import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-accent">&#9670;</span>
          <span>Elixir Proficiency</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
