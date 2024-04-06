document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const lobbyNameInput = document.getElementById('lobbyName');
    const playerNameInput = document.getElementById('playerName');
    const joinLobbyNameInput = document.getElementById('joinLobbyName');
    const joinLobbyButton = document.getElementById('joinLobbyByNameButton');
    const lobbiesContainer = document.getElementById('lobbies');

    document.getElementById('createLobby').addEventListener('click', () => {
        const lobbyName = lobbyNameInput.value.trim();
        const playerName = playerNameInput.value.trim();
        if (lobbyName && playerName) {
            socket.emit('createLobby', { playerId: playerName, lobbyDetails: { gameName: lobbyName } });
            lobbyNameInput.value = '';
            playerNameInput.value = '';
        }
    });

    joinLobbyButton.addEventListener('click', () => {
        const lobbyName = joinLobbyNameInput.value.trim();
        const playerName = playerNameInput.value.trim();
        if (lobbyName && playerName) {
            socket.emit('joinLobbyByName', { playerId: playerName, lobbyName });
            joinLobbyNameInput.value = '';
            playerNameInput.value = '';
        }
    });


    socket.on('lobbyUpdated', function(lobby) {
        let lobbyDiv = document.getElementById(`lobby-${lobby.lobbyId}`);
        if (!lobbyDiv) {
            lobbyDiv = document.createElement('div');
            lobbyDiv.id = `lobby-${lobby.lobbyId}`;
            lobbiesContainer.appendChild(lobbyDiv);
        }
        lobbyDiv.innerHTML = `<strong>Lobby: ${lobby.details.gameName}</strong><br>Players: <ul>` + lobby.players.map(player => `<li>${player}</li>`).join('') + `</ul>`;
    });
    socket.on('updateAllLobbies', function(allLobbies) {
        lobbiesContainer.innerHTML = ''; // Clear the lobbies container
        allLobbies.forEach(lobby => {
            const table = document.createElement('table');
            table.innerHTML = `<caption><strong>${lobby.gameName}</strong></caption>`;
            for (let i = 0; i < 5; i++) {
                const row = table.insertRow(-1); // Insert a new row at the end of the table
                const cell = row.insertCell(0); // Insert a new cell in the row
                cell.textContent = lobby.players[i] || ''; // Set cell text to player name or empty if less than 5 players
                cell.style.border = '1px solid black'; // Optional: Style the cell
            }
            lobbiesContainer.appendChild(table);
            table.style.border = '2px solid black'; // Optional: Style the table
            table.style.marginTop = '10px';
        });
    });

    document.getElementById('joinLobbyByNameButton').addEventListener('click', () => {
        const lobbyName = joinLobbyNameInput.value.trim();
        const playerName = document.getElementById('joinPlayerName').value.trim(); // Updated to use the separate input
        if (lobbyName && playerName) {
            socket.emit('joinLobbyByName', { playerId: playerName, lobbyName });
            joinLobbyNameInput.value = '';
            document.getElementById('joinPlayerName').value = ''; // Clear the input field after joining
        }
    });
    socket.on('error', function(message) {
        alert(message);
    });
});