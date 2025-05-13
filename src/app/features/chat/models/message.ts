/**
 * Classe représentant un message dans une conversation
 */
export interface Message {
  // Identifiant unique du message
  _id: string

  // Identifiant de la conversation
  conversationId: string

  // Identifiant de l'utilisateur
  userId: string

  // Contenu du message
  content: string

  // Date de création
  timestamp: string

  // Statut du message  
  status: 'sent' | 'sending' | 'failed' | 'read'
  
  // Type du message
  type?: 'text' | 'image' | 'file'
}

export type messages = Message[]
