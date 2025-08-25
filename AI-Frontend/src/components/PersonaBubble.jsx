import React from 'react';
import { motion } from 'framer-motion';

export default function PersonaBubble({ persona, message, isUser = false, delay = 0 }) {
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay * 0.1 }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-lg">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">You</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              U
            </div>
          </div>
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm shadow-lg">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="flex justify-start mb-4"
    >
      <div className="max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
            {persona.avatar}
          </div>
          <span className="text-sm font-medium text-foreground">{persona.name}</span>
        </div>
        <div className={`border p-4 rounded-2xl rounded-tl-sm shadow-sm ${persona.color}`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}