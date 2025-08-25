import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserInput({ onSubmit, disabled = false, placeholder = "Share your thoughts..." }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    setIsSubmitting(true);
    try {
      // The `onSubmit` prop now handles the API call
      await onSubmit(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error submitting message:', error);
      // TODO: Show an error to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] border-none resize-none focus-visible:ring-0 text-sm bg-card text-foreground placeholder:text-muted-foreground"
          disabled={disabled || isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!message.trim() || disabled || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Join Debate
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}