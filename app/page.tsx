import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <div className="app-layout">
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <ChatInterface />
      </main>
    </div>
  );
}
