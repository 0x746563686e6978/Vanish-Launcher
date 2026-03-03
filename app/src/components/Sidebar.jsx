import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Swords,
  Key,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { useStore } from '../store';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cheat-loader', icon: Swords, label: 'Cheat Loader' },
  { to: '/redeem', icon: Key, label: 'Redeem License' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/account', icon: User, label: 'Account' },
];

export default function Sidebar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <aside className="w-56 flex flex-col h-full pt-10 pb-4 px-3 glass-card rounded-none rounded-r-none border-r border-white/10 border-t-0 border-b-0 border-l-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">V</span>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Vanish</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="ml-auto w-1 h-1 rounded-full bg-purple-400"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile at bottom */}
      {user && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <img
              src={avatarUrl}
              alt={user.username}
              className="w-8 h-8 rounded-full ring-1 ring-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.username}</p>
              <p className="text-white/40 text-xs">Discord</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 text-sm transition-all duration-200"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
