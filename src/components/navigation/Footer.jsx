import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-600 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} digiReach. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-black">Privacy</Link>
            <Link to="/terms" className="hover:text-black">Terms</Link>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

