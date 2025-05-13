
export const environment = {

    //==========================[ URIs pour environnement Docker ]=========================
    api_docker: {

        //Pour la connexion websocket backend persist

        webSocketUrl: '/api/persist/ws',

        //Endpoints pour les messages et conversations

        baseUrl: '/api/chat',

        //Endpoints pour l'authentification

        auth: {
            baseUrl: '/api/authentication',
        }
    },
    //==========================[ URIs pour environnement local ]=========================//

    
}