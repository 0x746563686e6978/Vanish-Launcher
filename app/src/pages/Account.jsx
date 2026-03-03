import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Calendar } from 'lucide-react';
import { useStore } from '../store';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Account() {
  const { user, license } = useStore();

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <div>
      <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-white text-2xl font-bold">Account</h1>
        <p className="text-white/40 text-sm mt-1">Your profile information</p>
      </motion.div>

      <div className="max-w-md space-y-4">
        {/* Profile card */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={user?.username || 'User'}
              className="w-16 h-16 rounded-2xl ring-2 ring-white/10"
            />
            <div>
              <h2 className="text-white font-bold text-lg">{user?.username || 'Unknown'}</h2>
              <p className="text-white/40 text-sm">
                {user?.discriminator && user.discriminator !== '0'
                  ? `#${user.discriminator}`
                  : 'Discord User'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-4 h-4 rounded bg-[#5865F2]/20 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.875 19.875 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                </div>
                <span className="text-white/30 text-xs">Connected via Discord</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* License info */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-purple-400" />
            <h2 className="text-white font-semibold text-sm">License</h2>
          </div>

          {license ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">Status</span>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">Key</span>
                <span className="text-white text-sm font-mono">{license.code}</span>
              </div>
              {license.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Expires</span>
                  <span className="text-white/60 text-sm">
                    {new Date(license.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No active license</p>
          )}
        </motion.div>

        {/* Discord ID */}
        {user?.discordId && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-white/40" />
              <h2 className="text-white font-semibold text-sm">Identifiers</h2>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Discord ID</span>
              <span className="text-white/60 text-sm font-mono">{user.discordId}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
