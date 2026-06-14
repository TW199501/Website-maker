import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, LogOut, Menu, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import shopcraftLogoLight from '../../assets/logos/shopcraft-logo-light.svg';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { toggleMobileMenu } = useUI();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/[0.05] px-6 h-14 flex items-center shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors hover-lift"
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 hover-lift">
            <img src={shopcraftLogoLight} alt="ShopCraft Studio" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all relative hover-lift">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1 pl-3 bg-white/5 rounded-xl border border-white/[0.05] hover:bg-white/10 hover-lift transition-all"
                >
                  <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-soft">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 glass-panel rounded-xl z-20 py-2 overflow-hidden"
                      >
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={16} />
                          Profile Settings
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors hover-lift">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all hover-lift active:scale-95"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
