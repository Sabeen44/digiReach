import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold">
          digiReach
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/about" className="text-gray-700 hover:text-black">
            About
          </Link>
          <Link to="/locations" className="text-gray-700 hover:text-black">
            Locations
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-black">
            Contact
          </Link>

          {/* Auth */}
          <Link
            to="/login"
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
