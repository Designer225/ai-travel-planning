'use client';

import dynamic from 'next/dynamic';
const AIChatbot = dynamic(() => import('@/app/components/chat/AIChatbot'), { ssr: false });

export default function ChatPage() {
  return <AIChatbot />;
}



