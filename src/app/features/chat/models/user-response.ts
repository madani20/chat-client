/**
 * Classe représentant un utilisateur
 */
export interface UserResponse {
    // Identifiant unique de l'utilisateur
    userId: string

    // Nom d'utilisateur
    username: string

    // Adresse email
    email: string

    // Mot de passe
    password?: string

    // Token d'authentification
    token: string

    // Status de l'utilisateur
    status?: 'online' | 'offline' | 'away' | 'typing'

    // Rôle de l'utilisateur
    //role?: string[]
}
// tableau d'utilisateurs
export type users = UserResponse[]

