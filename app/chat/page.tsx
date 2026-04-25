import { ChatContainer } from '../../components/chat/ChatContainer';

export const metadata = {
  title: 'Chat — Asistente de Recursos AEC',
  description: 'Consulta con nuestro asistente IA para encontrar familias, plantillas y modelos BIM.',
};

export default function ChatPage() {
  return (
    <div className="app-layout" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ChatContainer />
    </div>
  );
}
