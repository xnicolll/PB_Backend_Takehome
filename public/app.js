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
            lobbyDiv.id = `lobby-${lobbyId}`;
    
            const lobbyHeaderDiv = document.createElement('div');
            lobbyHeaderDiv.className = 'lobby-header';
            lobbyHeaderDiv.innerHTML = `${lobby.details.gameName}`;
            const deleteSpan = document.createElement('span');
            deleteSpan.className = 'delete-lobby';
            deleteSpan.setAttribute('data-lobbyid', lobbyId);
            deleteSpan.textContent = '';
            lobbyHeaderDiv.appendChild(deleteSpan);
    
            lobbyDiv.appendChild(lobbyHeaderDiv);
    
            lobby.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player';
                playerDiv.textContent = player;
                const removeSpan = document.createElement('span');
                removeSpan.className = 'remove-player';
                removeSpan.setAttribute('data-lobbyid', lobbyId);
                removeSpan.setAttribute('data-playername', player);
                removeSpan.textContent = '';
                playerDiv.appendChild(removeSpan);
                lobbyDiv.appendChild(playerDiv);
            });
    
            // Check if the lobby is full
            if (lobby.players.length === 5) {
                lobbyDiv.classList.add('lobby-full');
    
                // Create and append the "game in progress" message
                const gameInProgressMessage = document.createElement('div');
                gameInProgressMessage.className = 'game-in-progress';
                gameInProgressMessage.textContent = `${lobby.details.gameName} has a game in progress`;
                lobbyDiv.appendChild(gameInProgressMessage); // Append the message to the lobbyDiv
            }
    
            lobbiesContainer.appendChild(lobbyDiv);
        });
    
        attachEventListeners();
    }
    

    function attachEventListeners() {
        document.querySelectorAll('.delete-lobby').forEach(button => {
            button.addEventListener('click', function() {
                const lobbyId = this.getAttribute('data-lobbyid');
                socket.emit('deleteLobby', { lobbyId });
            });
        });

        document.querySelectorAll('.remove-player').forEach(button => {
            button.addEventListener('click', function() {
                const lobbyId = this.getAttribute('data-lobbyid');
                const playerName = this.getAttribute('data-playername');
                socket.emit('removePlayer', { lobbyId, playerName });
            });
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

    socket.on('notification', (message) => {
        const notificationsList = document.getElementById('notificationsList');
        const newNotification = document.createElement('li');
        newNotification.textContent = message;
        notificationsList.appendChild(newNotification);
    });

    // Listen for server events
    socket.on('updateLobbies', function(data) {
        updateLobbiesDisplay(data.lobbies);
    });

    socket.on('error', function(errorMessage) {
        alert(errorMessage); // Display the error message from the server
    });
});
