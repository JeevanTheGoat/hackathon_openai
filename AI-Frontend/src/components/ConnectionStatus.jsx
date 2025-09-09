import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ConnectionStatus({ status }) {
  const statusConfig = {
    connected: {
      icon: Wifi,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      text: 'Live',
      description: 'Real-time updates active'
    },
    connecting: {
      icon: Loader2,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      text: 'Connecting...',
      description: 'Establishing connection'
    },
    disconnected: {
      icon: WifiOff,
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      text: 'Offline',
      description: 'Using cached data'
    }
  };

  const config = statusConfig[status] || statusConfig.disconnected;
  const IconComponent = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <Badge 
          variant="outline" 
          className={`flex items-center gap-2 ${config.color}`}
        >
          <IconComponent 
            className={`w-3 h-3 ${status === 'connecting' ? 'animate-spin' : ''}`} 
          />
          {config.text}
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}