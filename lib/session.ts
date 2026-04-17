import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'aec_session_id';
const CHAT_KEY = 'aec_chat_id';

/**
 * Get or create a session ID for anonymous users
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `anon_${uuidv4()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Get current chat ID
 */
export function getChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CHAT_KEY);
}

/**
 * Set current chat ID
 */
export function setChatId(chatId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_KEY, chatId);
}

/**
 * Clear chat ID (for new conversation)
 */
export function clearChatId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHAT_KEY);
}

/**
 * Clear all session data
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CHAT_KEY);
}
