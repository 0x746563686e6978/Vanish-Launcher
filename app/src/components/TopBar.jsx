import React from 'react';
import { X } from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';

export default function TopBar() {
  const handleClose = async () => {
    await appWindow.close();
  };

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 h-10 z-50 flex items-center justify-end px-3"
    >
      <button
        onClick={handleClose}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
