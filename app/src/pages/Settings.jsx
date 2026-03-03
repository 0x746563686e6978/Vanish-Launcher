import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, Monitor, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${enabled ? 'bg-purple-500' : 'bg-white/10'}`}
  >
    <motion.div
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
    />
  </button>
);

export default function Settings() {
  const [autoLaunch, setAutoLaunch] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-white text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure your launcher preferences</p>
      </motion.div>

      <div className="max-w-md space-y-4">
        {/* Preferences */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-5"
        >
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={16} className="text-white/40" />
                <div>
                  <p className="text-white text-sm">Auto Launch</p>
                  <p className="text-white/30 text-xs">Start on system boot</p>
                </div>
              </div>
              <Toggle enabled={autoLaunch} onChange={setAutoLaunch} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={16} className="text-white/40" />
                <div>
                  <p className="text-white text-sm">Dark Mode</p>
                  <p className="text-white/30 text-xs">Always dark (recommended)</p>
                </div>
              </div>
              <Toggle enabled={darkMode} onChange={setDarkMode} />
            </div>
          </div>
        </motion.div>

        {/* App info */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">About</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Version</span>
              <span className="text-white text-sm font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Build</span>
              <span className="text-white text-sm font-mono">stable</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Framework</span>
              <span className="text-white text-sm">Tauri + React</span>
            </div>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-5 border-red-500/20"
        >
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">Account</h2>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 font-medium py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <LogOut size={14} />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
