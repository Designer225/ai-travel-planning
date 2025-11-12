'use client';

import dynamic from 'next/dynamic';
const AIChatbot = dynamic(() => import('@/components/chat/AIChatbot'), { ssr: false });

export default function ChatPage() {
  return <AIChatbot />;
}

