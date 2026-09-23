"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary-500 text-white">

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold leading-tight">Évangéliste Ahongan Komlavi</span>
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-primary-300">Ministère Évangélique</span>
              </div>
            </Link>
            <p className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed mt-6">
              <MapPin className="w-5 h-5 text-primary-300 mt-0.5 flex-shrink-0" />
              <span>Centre de prière ESPRIT ET VIE<br />Djagblé-Abolavé, Quartier des Vainqueurs</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider mb-6 text-white">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">{tNav("about")}</Link></li>
              <li><Link href="/sermons" className="text-slate-400 hover:text-white transition-colors text-sm">{tNav("sermons")}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">{tNav("contact")}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider mb-6 text-white">
              {t("contactTitle")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <a href="tel:+22890877855" className="text-slate-400 hover:text-white transition-colors text-sm">
                  +228 90 87 78 55
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <a href="tel:+22899697848" className="text-slate-400 hover:text-white transition-colors text-sm">
                  +228 99 69 78 48
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <a href="mailto:priere@evangelisteahongakomlavi.com" className="text-slate-400 hover:text-white transition-colors text-sm">
                  priere@evangelisteahongakomlavi.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Follow */}
          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider mb-6 text-white">
              {t("followTitle")}
            </h4>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/22890877855" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-body font-semibold uppercase tracking-wider">
                {t("social.whatsapp")}
              </a>
              <a href="https://www.facebook.com/Evahongankomlavi/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-body font-semibold uppercase tracking-wider">
                {t("social.facebook")}
              </a>
              <a href="https://www.youtube.com/@Evang%C3%A9listeahongankomlavi" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-body font-semibold uppercase tracking-wider">
                {t("social.youtube")}
              </a>
              <a href="https://www.tiktok.com/@evangelisteahongankomlav" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-body font-semibold uppercase tracking-wider">
                {t("social.tiktok")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} - Évangéliste Ahongan Komlavi. Tous droits réservés by{" "}
            <a
              href="https://wa.me/22890035979/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:underline"
            >
              Oelnet
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
