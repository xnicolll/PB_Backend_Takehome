const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;
const lobbies = {};

// Serve static files from the public directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createLobby', ({ playerId, lobbyDetails }) => {
        const lobbyId = Date.now().toString(); // Using timestamp as a simple unique ID
        lobbies[lobbyId] = { players: [playerId], details: lobbyDetails };
        socket.join(lobbyId);
        io.to(lobbyId).emit('lobbyUpdated', lobbies[lobbyId]);
        // After creating a lobby or adding a player to a lobby
        broadcastLobbies();
    });

    socket.on('joinLobbyByName', ({ playerId, lobbyName }) => {
        // Find the lobby by name
        const lobbyId = Object.keys(lobbies).find(id => lobbies[id].details.gameName === lobbyName);
        if (!lobbyId) {
            socket.emit('error', 'Lobby does not exist.');
            return;
        }
        
        const lobby = lobbies[lobbyId];
        // Check for duplicate player names in the lobby
        if (lobby.players.includes(playerId)) {
            socket.emit('error', 'Player name already exists in the lobby.');
            return;
        }
    
        lobby.players.push(playerId);
        socket.join(lobbyId);
        // Update all clients about the change
        updateAllLobbies(); // Assume you have this function to emit updates about all lobbies

        // After creating a lobby or adding a player to a lobby
        broadcastLobbies();
    });
    
    

    socket.on('leaveLobby', ({ playerId, lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            const index = lobby.players.indexOf(playerId);
            if (index !== -1) {
                lobby.players.splice(index, 1);
                socket.leave(lobbyId);
                if (lobby.players.length === 0) {
                    delete lobbies[lobbyId];
                } else {
                    io.to(lobbyId).emit('lobbyUpdated', lobby);
                }
            }
        }

        // After creating a lobby or adding a player to a lobby
        broadcastLobbies();
    });

    socket.on('startGame', (lobbyId) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.players.length >= 2) { // Example condition for starting a game
            io.to(lobbyId).emit('gameStarted', lobby);
            delete lobbies[lobbyId];
        }
    });

    socket.on('createLobby', ({ playerId, lobbyDetails }) => {
        // Check if lobby name already exists
        for (let id in lobbies) {
            if (lobbies[id].details.gameName === lobbyDetails.gameName) {
                socket.emit('error', 'Lobby name already exists.');
                return;
            }
        }
        const lobbyId = Date.now().toString();
        lobbies[lobbyId] = { players: [playerId], details: lobbyDetails };
        socket.join(lobbyId);
        io.emit('lobbyUpdated', { lobbyId, ...lobbies[lobbyId] }); // Emit to all clients

        // After creating a lobby or adding a player to a lobby
        broadcastLobbies();
    });

    function updateAllLobbies() {
        const allLobbies = Object.keys(lobbies).map(key => ({
            lobbyId: key,
            ...lobbies[key]
        }));
        console.log('Updating all lobbies:', allLobbies); // Add this line
        io.emit('updateAllLobbies', allLobbies);

        // After creating a lobby or adding a player to a lobby
        broadcastLobbies();
    }

});

server.listen(port, () => console.log(`Listening on port ${port}`));