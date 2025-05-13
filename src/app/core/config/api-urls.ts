import { environment } from "./environment";

/**
 * Endpoints pour l'authentification
 */
export const API_ENDPOINTS_AUTH = {
    register: `${environment.api_docker.auth.baseUrl}/register`,
    login: `${environment.api_docker.auth.baseUrl}/login`,
    me: `${environment.api_docker.auth.baseUrl}/me`,
    getUserById: (userId: string) => `${environment.api_docker.auth.baseUrl}/users/${userId}`,
}

/**
 * Endpoints  pour les messages et conversations 
 */
export const API_ENDPOINTS_PERSIST = {
    getUsers: `${environment.api_docker.baseUrl}/users`,
    saveMessages: `${environment.api_docker.baseUrl}/messages`,
    getMessagesByConversationId: (conversationId: string) => `${environment.api_docker.baseUrl}/messages?conversationId=${conversationId}`,
    getAllConversations: `${environment.api_docker.baseUrl}/conversations`,
    saveConversation: `${environment.api_docker.baseUrl}/conversations`,
}