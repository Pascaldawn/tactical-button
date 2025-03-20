
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-lg lg:text-xl">Football Tactics</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/board" 
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === '/board' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Tactics Board
                </Link>
                <Link 
                  to="/subscription" 
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === '/subscription' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Subscription
                </Link>
                <div className="relative inline-block text-left">
                  <button 
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                    onClick={toggleProfileMenu}
                  >
                    <User size={18} />
                    <span>{user?.name}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 text-sm hover:bg-secondary"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to="/settings" 
                          className="block px-4 py-2 text-sm hover:bg-secondary"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings size={16} className="inline mr-2" />
                          Account Settings
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary"
                        >
                          <LogOut size={16} className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-sm border-b border-border">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md font-medium hover:bg-secondary"
              onClick={closeMenu}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md font-medium hover:bg-secondary"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/board"
                  className="block px-3 py-2 rounded-md font-medium hover:bg-secondary"
                  onClick={closeMenu}
                >
                  Tactics Board
                </Link>
                <Link
                  to="/subscription"
                  className="block px-3 py-2 rounded-md font-medium hover:bg-secondary"
                  onClick={closeMenu}
                >
                  Subscription
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md font-medium hover:bg-secondary"
                  onClick={closeMenu}
                >
                  <Settings size={16} className="inline mr-2" />
                  Account Settings
                </Link>
                <div className="border-t border-border mt-2 pt-2">
                  <div className="px-3 py-2 font-medium">
                    <User size={16} className="inline mr-2" />
                    {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-destructive font-medium flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md font-medium text-primary hover:bg-secondary"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
