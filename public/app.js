document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server

    const createLobbyButton = document.getElementById('createLobby');
    const joinLobbyButton = document.getElementById('joinLobbyByNameButton');

    const playerNameInput = document.getElementById('playerName');
    const lobbyNameInput = document.getElementById('lobbyName');
    const joinLobbyNameInput = document.getElementById('joinLobbyName');
    const joinPlayerNameInput = document.getElementById('joinPlayerName');
    const lobbiesContainer = document.getElementById('lobbies');

    // Function to clear input fields
    function clearInputs() {
        playerNameInput.value = '';
        lobbyNameInput.value = '';
        joinLobbyNameInput.value = '';
        joinPlayerNameInput.value = '';
    }

    // Function to dynamically update the lobbies display
    function updateLobbiesDisplay(lobbies) {
        lobbiesContainer.innerHTML = ''; // Clear existing content
        Object.entries(lobbies).forEach(([lobbyId, lobby], index) => {
            const lobbyDiv = document.createElement('div');
            lobbyDiv.className = 'lobby';
            lobbyDiv.innerHTML = `<div class="lobby-header">Lobby ${index + 1}: ${lobby.details.gameName}</div>`;
            lobby.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = player;
                playerDiv.className = 'player';
                lobbyDiv.appendChild(playerDiv);
            });
            lobbiesContainer.appendChild(lobbyDiv);
        });
    }

    // Handle create lobby
    createLobbyButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        const lobbyName = lobbyNameInput.value.trim();

        if (playerName && lobbyName) {
            socket.emit('createLobby', { playerId: playerName, lobbyDetails: { gameName: lobbyName } });
            clearInputs();
        } else {
            alert('Both player name and lobby name are required to create a lobby.');
        }
    });

    // Handle join lobby
    joinLobbyButton.addEventListener('click', () => {
        const playerName = joinPlayerNameInput.value.trim();
        const lobbyName = joinLobbyNameInput.value.trim();

        if (playerName && lobbyName) {
            socket.emit('joinLobbyByName', { playerId: playerName, lobbyName: lobbyName });
            clearInputs();
        } else {
            alert('Both player name and lobby name are required to join a lobby.');
        }
    });

    // Listen for server events
    socket.on('updateLobbies', function(data) {
        updateLobbiesDisplay(data.lobbies);
    });

    socket.on('error', function(errorMessage) {
        alert(errorMessage); // Display the error message from the server
    });
});
