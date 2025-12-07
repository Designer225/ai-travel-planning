'use client';

import { memo } from 'react';
import { Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatMessageProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessage = memo(function ChatMessage({ message, onSuggestionClick }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3 items-start ${isAssistant ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAssistant ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'
        }`}
      >
        {isAssistant ? (
          <Sparkles className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div className="flex-1 max-w-[85%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAssistant
              ? 'bg-gray-100 text-gray-900 rounded-tl-sm'
              : 'bg-blue-600 text-white rounded-tr-sm'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <div
            className={`text-xs mt-1.5 ${
              isAssistant ? 'text-gray-500' : 'text-blue-100'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Suggestions */}
        {isAssistant && message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});



