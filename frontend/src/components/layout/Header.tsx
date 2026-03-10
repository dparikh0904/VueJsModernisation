import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout.mutate();
  };

  return (
    <header className="bg-gradient-default text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <img src="/img/brand/white.png" alt="Argon Design" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-white/80 transition">
                <span>Examples</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-secondary-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/landing" className="block px-4 py-2 hover:bg-secondary-100 rounded-t-lg">Landing</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-secondary-100">Profile</Link>
                <Link to="/login" className="block px-4 py-2 hover:bg-secondary-100">Login</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-secondary-100">Register</Link>
                <Link to="/components" className="block px-4 py-2 hover:bg-secondary-100 rounded-b-lg">Components</Link>
              </div>
            </div>

            {isAuthenticated && user ? (
              <>
                <span className="text-white/90">
                  {user.name} {user.surname}
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:text-white/80 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white/80 transition">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="neutral" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/landing" className="block py-2 hover:text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Landing</Link>
            <Link to="/profile" className="block py-2 hover:text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
            <Link to="/components" className="block py-2 hover:text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Components</Link>
            
            {isAuthenticated && user ? (
              <>
                <div className="py-2 text-white/90">
                  {user.name} {user.surname}
                </div>
                <button
                  onClick={(e) => {
                    handleLogout(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 hover:text-white/80"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}