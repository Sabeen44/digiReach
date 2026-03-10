import { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import digiImage from "../../assets/logos/digiReach-Logo.png";
import { useAuth } from "../../hooks/useAuth";
import UpgradeNudge from "./UpgradeNudge";
import DesktopNav from "./DesktopNav";
import DesktopAuth from "./DesktopAuth";
import MobileMenu from "./MobileMenu";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isHome = currentPath === "/";

  const { session, hasSubscription, sessionLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (sessionLoading) return null;

  return (
    <>
      <UpgradeNudge show={session && !hasSubscription} />

      <header
        className={`fixed inset-x-0 top-0 z-50 bg-gray-950 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md border-b border-white/[0.06] shadow-xl shadow-black/20" : ""
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 flex items-center justify-between h-24">

          {/* Logo */}
          <div className="flex flex-1">
            <Link to="/" className="flex items-center -m-1.5 p-1.5">
              <span className="sr-only">digiReach</span>
              <img src={digiImage} alt="digiReach" className="h-40 w-auto" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <DesktopNav currentPath={currentPath} isHome={isHome} />
          <DesktopAuth session={session} hasSubscription={hasSubscription} />
        </nav>

        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentPath={currentPath}
          isHome={isHome}
          session={session}
          hasSubscription={hasSubscription}
        />
      </header>
    </>
  );
}