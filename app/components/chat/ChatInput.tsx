'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Box, Button, Input } from '@mui/material';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box display='flex' gap={2}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ask me anything about travel..."
        disabled={disabled}
        sx={{ flex: 1 }}
        inputProps={{ 'aria-label': 'Chat message input' }}
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="gradient-button"
        aria-label="Send chat message"
      >
        <Send className="w-4 h-4" color="#fff" />
      </Button>
    </Box>
  );
}


