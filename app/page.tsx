import { ChatContainer } from '../components/chat/ChatContainer';

export default function Home() {
  return (
    <div className="app-layout" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ChatContainer />
    </div>
  );
}
