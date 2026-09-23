"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  // Only the homepage has a dark hero directly under the header, which is
  // what the transparent + white-text treatment assumes. Every other page
  // starts on a light background, so white nav text there was invisible
  // until the user scrolled 50px — this was reported as "the menu doesn't
  // show up". Those pages get the solid/dark-text header from the start.
  const hasHero = pathname === "/";
  const scrolled = !hasHero || scrolledPast;

  useEffect(() => {
    if (!hasHero) return;
    const handleScroll = () => setScrolledPast(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasHero]);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Vision", href: "/#vision" },
    { name: "Requêtes", href: "/sermons" },
    { name: "Galerie", href: "/galerie" },
    { name: "Dons", href: "/#dons" },
    { name: "Contact", href: "/about#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-custom flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span
              className={`font-display text-xl font-bold leading-tight transition-colors ${
                scrolled ? "text-slate-800" : "text-white"
              }`}
            >
              Ahongan Komlavi
            </span>
            <span
              className={`font-body text-xs font-semibold uppercase tracking-wider transition-colors ${
                scrolled ? "text-primary-600" : "text-primary-300"
              }`}
            >
              Ministère Évangélique
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-body text-sm font-semibold uppercase tracking-wider transition-colors ${
                scrolled ? "text-slate-700 hover:text-primary-700" : "text-white hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="https://wa.me/22890877855"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary-600 px-5 py-2 font-body text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary-700"
          >
            Soutenir
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className={`w-6 h-6 ${scrolled ? "text-slate-800" : "text-white"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? "text-slate-800" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100">
          <nav className="container-custom py-4" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <div key={item.name} className="py-2">
                <Link
                  href={item.href}
                   className="block py-2 font-body text-sm font-semibold uppercase tracking-wider text-slate-700 hover:text-primary-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <a
                href="https://wa.me/22890877855"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-primary-600 px-5 py-2 font-body text-sm font-semibold uppercase tracking-wider text-white"
                onClick={() => setMobileOpen(false)}
              >
                Soutenir
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
