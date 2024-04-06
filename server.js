const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;
const lobbies = {};
let lobbyCount = 0; // Track the number of lobbies to limit to 5

// Serve static files from the public directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast the current state of lobbies to all clients
    function broadcastLobbies() {
        io.emit('updateLobbies', { lobbies });
    }

    socket.on('createLobby', ({ playerId, lobbyDetails }) => {
        if (lobbyCount >= 5) {
            socket.emit('error', 'Maximum number of lobbies reached.');
            return;
        }

        // Check if lobby name already exists
        const existingLobby = Object.values(lobbies).find(lobby => lobby.details.gameName === lobbyDetails.gameName);
        if (existingLobby) {
            socket.emit('error', 'Lobby name already exists.');
            return;
        }

        const lobbyId = Date.now().toString();
        lobbies[lobbyId] = { players: [playerId], details: lobbyDetails };
        lobbyCount++;
        broadcastLobbies();
    });

    socket.on('joinLobbyByName', ({ playerId, lobbyName }) => {
        const lobbyId = Object.keys(lobbies).find(id => lobbies[id].details.gameName === lobbyName);
        if (!lobbyId) {
            socket.emit('error', 'Lobby does not exist.');
            return;
        }

        const lobby = lobbies[lobbyId];
        if (lobby.players.length >= 5) {
            socket.emit('error', 'This lobby is full.');
            return;
        }

        if (lobby.players.includes(playerId)) {
            socket.emit('error', 'Player name already exists in the lobby.');
            return;
        }

        lobby.players.push(playerId);
        broadcastLobbies();
    });

    socket.on('deleteLobby', ({ lobbyId }) => {
        delete lobbies[lobbyId];
        lobbyCount--;
        broadcastLobbies();
    });
    
    socket.on('removePlayer', ({ lobbyId, playerName }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            lobbies[lobbyId].players = lobby.players.filter(player => player !== playerName);
            broadcastLobbies();
        }
    });

    broadcastLobbies(); // Initial broadcast to update any connecting clients
});

server.listen(port, () => console.log(`Listening on port ${port}`));
