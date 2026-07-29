"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export type PaletteModule = { slug: string; title: string; order: number };
export type PaletteTerm = { id: string; term: string; shortDefinition: string };

const PAGES = [
  { href: "/modules", label: "All modules" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/workshops", label: "Workshops" },
  { href: "/review", label: "Review what you learned" },
  { href: "/certificates", label: "Certificates" },
];

export function CommandPalette({
  modules,
  terms,
}: {
  modules: PaletteModule[];
  terms: PaletteTerm[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search the course"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-border px-1 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the course"
        description="Jump to a module, glossary term, or page"
      >
        <Command>
          <CommandInput placeholder="Search modules, terms, pages…" />
          <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Modules">
            {modules.map((mod) => (
              <CommandItem
                key={mod.slug}
                value={`module ${mod.order} ${mod.title}`}
                onSelect={() => go(`/modules/${mod.slug}`)}
              >
                <span className="text-muted-foreground">{mod.order}.</span>
                {mod.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            {PAGES.map((page) => (
              <CommandItem
                key={page.href}
                value={page.label}
                onSelect={() => go(page.href)}
              >
                {page.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Glossary">
            {terms.map((term) => (
              <CommandItem
                key={term.id}
                value={`${term.term} ${term.shortDefinition}`}
                onSelect={() => go(`/glossary#${term.id}`)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{term.term}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {term.shortDefinition}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
