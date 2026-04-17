'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Header } from '../Header';
import { getChatId, setChatId } from '@/lib/session';

export function ChatContainer() {
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check initial chat ID on mount
    const savedChatId = getChatId();
    if (savedChatId) {
      setCurrentChatIdState(savedChatId);
    }
    
    // Auto collapse sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatIdState(chatId);
    setChatId(chatId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentChatIdState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aec_chat_id');
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Sidebar Area */}
      <Sidebar 
        currentChatId={currentChatId} 
        onSelectChat={handleSelectChat} 
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Header toggleSidebar={toggleSidebar} />
        <ChatInterface 
          currentChatId={currentChatId} 
          onChatCreated={handleSelectChat}
        />
      </div>
    </div>
  );
}
