import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

interface MT5StatusProps {
  tradesCount: number;
  lastTradeTime?: number;
}

interface MT5StatusData {
  connected: boolean;
  lastUpdate: number;
  account: number;
  server: string;
  balance: number;
}

/**
 * MT5 Status Component
 * Shows connection status and sync info
 */
export const MT5Status: React.FC<MT5StatusProps> = ({ tradesCount, lastTradeTime }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  const [mt5Status, setMT5Status] = useState<MT5StatusData | null>(null);

  useEffect(() => {
    // Listen to MT5 status from Firebase
    const statusRef = ref(database, 'mt5Status');
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val() as MT5StatusData | null;
      setMT5Status(data);
      
      if (data) {
        const now = Date.now();
        const timeDiff = now - data.lastUpdate;
        
        // If last update was within 30 seconds, consider it connected
        if (data.connected && timeDiff < 30000) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'syncing': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'MT5 Connected';
      case 'syncing': return 'Syncing...';
      case 'disconnected': return 'MT5 Disconnected';
    }
  };

  const formatLastSync = () => {
    if (!mt5Status?.lastUpdate) return 'Never';
    
    const now = Date.now();
    const diff = now - mt5Status.lastUpdate;
    
    if (diff < 10000) return 'Just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-dark-text">MT5 Integration</h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status:</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <span className="text-dark-text font-medium">{getStatusText()}</span>
          </div>
        </div>

        {/* Account Info */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Account:</span>
          <span className="text-dark-text font-medium">{mt5Status?.account || '159825187'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Server:</span>
          <span className="text-dark-text font-medium">{mt5Status?.server || 'Exness-MT5Real20'}</span>
        </div>

        {/* Sync Info */}
        <div className="border-t border-dark-border pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Trades Synced:</span>
            <span className="text-primary font-bold text-xl">{tradesCount}</span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-400">Last Sync:</span>
            <span className="text-dark-text">{formatLastSync()}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-dark-bg border border-blue-500/30 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-400 text-xl">ℹ️</span>
            <div className="text-sm text-gray-400">
              <p className="font-medium text-blue-400 mb-1">Auto-Sync Enabled</p>
              <p>Trades are automatically synced from your MT5 account when you close positions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
