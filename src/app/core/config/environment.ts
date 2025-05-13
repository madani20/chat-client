
export const environment = {

    //==========================[ URIs pour environnement Docker ]=========================
    api_docker: {

        //Pour la connexion websocket backend persist

        //webSocketUrl: '/api/persist/ws',
        webSocketUrl: 'wss://chat-persist.onrender.com/api/persist/ws',

        //Endpoints pour les messages et conversations

        //baseUrl: '/api/chat',
        baseUrl: 'https://chat-persist.onrender.com/api/chat',

        //Endpoints pour l'authentification

        auth: {
            //baseUrl: '/api/authentication',
            baseUrl: 'https://chat-auth-j6ww.onrender.com/api/authentication',
        }
    },
    //==========================[ URIs pour environnement local ]=========================//

    
}