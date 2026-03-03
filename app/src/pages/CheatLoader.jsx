import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { homeDir } from '@tauri-apps/api/path';
import api from '../api/axios';
import { useStore } from '../store';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusMap = {
  idle: { color: 'text-white/40', dot: 'bg-white/20', label: 'Ready' },
  loading: { color: 'text-blue-400', dot: 'bg-blue-400', label: 'Loading...' },
  success: { color: 'text-green-400', dot: 'bg-green-400', label: 'Loaded' },
  error: { color: 'text-red-400', dot: 'bg-red-400', label: 'Error' },
};

export default function CheatLoader() {
  const { cheatStatus, setCheatStatus } = useStore();
  const [minecraftLoading, setMinecraftLoading] = useState(false);

  const loadCS2 = async () => {
    setCheatStatus('cs2', 'loading');
    try {
      await api.post('/cheat/cs2/load');
      setCheatStatus('cs2', 'success');
      toast.success('CS2 loader initialized!');
    } catch (err) {
      setCheatStatus('cs2', 'error');
      toast.error(err.response?.data?.error || 'CS2 loader failed');
    }
  };

  const downloadMinecraft = async () => {
    setMinecraftLoading(true);
    setCheatStatus('minecraft', 'loading');
    try {
      const res = await api.get('/cheat/minecraft/download', {
        responseType: 'arraybuffer',
      });

      // Save to Desktop using Tauri filesystem API
      const home = await homeDir();
      const desktopPath = `${home}/Desktop/minecraft-loader.jar`;

      await writeBinaryFile(desktopPath, new Uint8Array(res.data));

      setCheatStatus('minecraft', 'success');
      toast.success('minecraft-loader.jar saved to Desktop!');
    } catch (err) {
      setCheatStatus('minecraft', 'error');
      toast.error(err.response?.data?.error || 'Download failed');
    } finally {
      setMinecraftLoading(false);
    }
  };

  const cs2Status = statusMap[cheatStatus.cs2] || statusMap.idle;
  const mcStatus = statusMap[cheatStatus.minecraft] || statusMap.idle;

  return (
    <div>
      <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-white text-2xl font-bold">Cheat Loader</h1>
        <p className="text-white/40 text-sm mt-1">Load your cheats securely</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 max-w-xl">
        {/* CS2 Loader Card */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                <Swords size={20} className="text-orange-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">CS2 Loader</h2>
                <p className="text-white/40 text-xs">Counter-Strike 2</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cs2Status.dot} ${cheatStatus.cs2 === 'loading' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs ${cs2Status.color}`}>{cs2Status.label}</span>
            </div>
          </div>

          <p className="text-white/40 text-xs mb-5">
            Initializes secure loader process for CS2. Requires active license.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadCS2}
            disabled={cheatStatus.cs2 === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 hover:border-orange-500/50 text-orange-300 font-medium py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cheatStatus.cs2 === 'loading' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : cheatStatus.cs2 === 'success' ? (
              <CheckCircle size={14} />
            ) : cheatStatus.cs2 === 'error' ? (
              <XCircle size={14} />
            ) : (
              <Swords size={14} />
            )}
            {cheatStatus.cs2 === 'loading' ? 'Loading...' : cheatStatus.cs2 === 'success' ? 'Loaded' : 'Load CS2'}
          </motion.button>
        </motion.div>

        {/* Minecraft Loader Card */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Download size={20} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Minecraft Loader</h2>
                <p className="text-white/40 text-xs">Downloads .jar to Desktop</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${mcStatus.dot} ${cheatStatus.minecraft === 'loading' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs ${mcStatus.color}`}>{mcStatus.label}</span>
            </div>
          </div>

          <p className="text-white/40 text-xs mb-5">
            Downloads <code className="text-green-400/70 font-mono">minecraft-loader.jar</code> to your Desktop. Requires active license.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadMinecraft}
            disabled={minecraftLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-500/50 text-green-300 font-medium py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {minecraftLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : cheatStatus.minecraft === 'success' ? (
              <CheckCircle size={14} />
            ) : (
              <Download size={14} />
            )}
            {minecraftLoading ? 'Downloading...' : cheatStatus.minecraft === 'success' ? 'Downloaded' : 'Download JAR'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
