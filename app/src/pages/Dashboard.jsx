import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Swords, Activity } from 'lucide-react';
import { useStore } from '../store';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, license } = useStore();

  const stats = [
    {
      icon: Shield,
      label: 'License',
      value: license ? 'Active' : 'Inactive',
      color: license ? 'text-green-400' : 'text-red-400',
      bg: license ? 'bg-green-400/10' : 'bg-red-400/10',
    },
    {
      icon: Swords,
      label: 'Cheats',
      value: 'Available',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      icon: Activity,
      label: 'Status',
      value: 'Online',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: Key,
      label: 'Access',
      value: license ? 'Granted' : 'Restricted',
      color: license ? 'text-green-400' : 'text-yellow-400',
      bg: license ? 'bg-green-400/10' : 'bg-yellow-400/10',
    },
  ];

  return (
    <div className="h-full">
      {/* Welcome header */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-white text-2xl font-bold">
          Welcome back{user ? `, ${user.username}` : ''}
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Here's what's happening with your account
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-white/40 text-xs mb-1">{stat.label}</p>
            <p className={`font-semibold text-sm ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* License info card */}
      {license && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-5 border-green-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-white/60 text-xs font-medium">Active License</span>
          </div>
          <p className="text-white text-sm font-mono">{license.code}</p>
          {license.expiresAt && (
            <p className="text-white/30 text-xs mt-1">
              Expires: {new Date(license.expiresAt).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      )}

      {!license && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-5 border-yellow-500/20"
        >
          <p className="text-white/60 text-sm">No active license. Head to <span className="text-yellow-400">Redeem License</span> to activate.</p>
        </motion.div>
      )}
    </div>
  );
}
