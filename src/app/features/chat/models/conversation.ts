/**
 * Classe représentant une conversation
 */
export interface Conversation {
    // Identifiant unique de la conversation
    _id: string

    // Nom de la conversation
    name: string

    // Liste des identifiants des participants à la conversation 
    participants: string[] 

    // Identifiant du dernier message
    lastMessageId: string  | undefined 

    // Date de création
    createdAt: string 

    // Date de dernière mise à jour
    updatedAt: string 
   
}
// tableau de conversations
export type conversations = Conversation[] 