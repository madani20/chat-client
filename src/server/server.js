const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:80', // Remplacez par l'URL de votre application Angular
        methods: ['GET', 'POST']        
    }
})

io.on('connection', (socket) => {
    console.log('Client connecté: ' + socket.id)

    socket.on('message', (message) => {
        console.log('Message reçu: ' + message)
        io.emit('message', message) // diffuse à tous les clients
    })

    socket.on('userStatus', (user) => {
        console.log('Statut reçu: ', user)
        io.emit('userStatus', user)
    })
})

// server.listen(3000, () => {
//     console.log('Serveur démarré sur le port 3000')
// })

