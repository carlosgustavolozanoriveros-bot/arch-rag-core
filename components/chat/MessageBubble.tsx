'use client';

interface MessageBubbleProps {
  role: string;
  content: string;
  user?: {
    avatar_url?: string;
    display_name?: string;
  } | null;
}

export function MessageBubble({ role, content, user }: MessageBubbleProps) {
  if (!content || content.trim() === '') return null;

  const isAssistant = role === 'assistant';

  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph, i) => {
        // Process bold
        const processed = paragraph.replace(
          /\*\*(.*?)\*\*/g,
          '<strong>$1</strong>'
        );
        // Process inline code
        const withCode = processed.replace(
          /`(.*?)`/g,
          '<code>$1</code>'
        );
        // Process emoji bullet lists
        const withLists = withCode.replace(
          /^[-•]\s/gm,
          '• '
        );

        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: withLists }}
          />
        );
      });
  };

  return (
    <div className="message">
      <div className={`message-avatar ${isAssistant ? 'assistant' : 'user'}`}>
        {isAssistant ? (
          '🏗️'
        ) : user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          '👤'
        )}
      </div>
      <div className="message-content">
        <div className="message-role">
          {isAssistant ? 'Asistente de Recursos AEC' : (user?.display_name || 'Tú')}
        </div>
        <div className="message-text">
          {formatContent(content)}
        </div>
      </div>
    </div>
  );
}
