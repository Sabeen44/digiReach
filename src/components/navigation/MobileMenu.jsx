import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import digiImage from "../../assets/logos/digiReach-Logo.png";
import Logout from "../../pages/Logout";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Locations", href: "/locations" },
  { name: "Contact", href: "/contact" },
];

export default function MobileMenu({ open, onClose, currentPath, isHome, session, hasSubscription }) {
  return (
    <Dialog open={open} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-gray-950 border-l border-white/[0.06] p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" onClick={onClose}>
            <img src={digiImage} alt="digiReach" className="h-16 w-auto" />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="space-y-1">
          {!isHome && (
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              Home
            </Link>
          )}
          {navigation.map((item) => {
            const isActive = item.href === currentPath;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "text-white bg-white/[0.08] border border-white/[0.08]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/[0.06]" />

        {/* Auth */}
        <div className="space-y-2">
          {!session && (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.25)" }}
              >
                Sign up
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </>
          )}

          {session && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
          )}

          {session && <Logout />}
        </div>
      </DialogPanel>
    </Dialog>
  );
}