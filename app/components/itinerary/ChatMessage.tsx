import { Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
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
    </div>
  );
}
