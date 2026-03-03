import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useStore } from '../store';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fetchLicenseStatus = async (setLicenseStatus) => {
  try {
    const res = await api.get('/license/status');
    setLicenseStatus(res.data);
  } catch {
    // Silently fail
  }
};

export default function RedeemLicense() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);
  const { setLicense } = useStore();

  useEffect(() => {
    fetchLicenseStatus(setLicenseStatus);
  }, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/license/redeem', { code: code.trim() });
      setLicense(res.data.license);
      toast.success('License redeemed successfully!');
      setCode('');
      fetchLicenseStatus(setLicenseStatus);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to redeem license');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-white text-2xl font-bold">Redeem License</h1>
        <p className="text-white/40 text-sm mt-1">Enter your license key to unlock features</p>
      </motion.div>

      <div className="max-w-md">
        {/* Current license status */}
        {licenseStatus && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`glass-card p-4 mb-5 flex items-center gap-3 ${licenseStatus.active ? 'border-green-500/20' : 'border-yellow-500/20'}`}
          >
            {licenseStatus.active ? (
              <CheckCircle size={18} className="text-green-400 shrink-0" />
            ) : (
              <XCircle size={18} className="text-yellow-400 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-medium ${licenseStatus.active ? 'text-green-400' : 'text-yellow-400'}`}>
                {licenseStatus.active ? 'Active License' : 'No Active License'}
              </p>
              {licenseStatus.license && (
                <p className="text-white/40 text-xs mt-0.5 font-mono">{licenseStatus.license.code}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Redeem form */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Key size={16} className="text-purple-400" />
            <h2 className="text-white font-semibold text-sm">Enter License Key</h2>
          </div>

          <form onSubmit={handleRedeem}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              maxLength={19}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors mb-4"
              style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Key size={14} />
              )}
              {loading ? 'Redeeming...' : 'Redeem License'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
