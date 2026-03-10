import { Link } from "react-router-dom";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Locations", href: "/locations" },
  { name: "Contact", href: "/contact" },
];

export default function DesktopNav({ currentPath, isHome }) {
  return (
    <div className="hidden lg:flex items-center gap-1">
      {!isHome && (
        <Link
          to="/"
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? "text-white bg-white/[0.08]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.name}
            {isActive && (
              <span className="block h-px mt-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}