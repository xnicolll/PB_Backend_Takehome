# Simple Game Lobby System

Prompt: Develop a backend system that manages game lobbies for a multiplayer game. The system should allow players to create lobbies, join and leave lobbies, and start a game when all players are ready.

## Getting Started

### Dependencies

Before using this system, ensure you have:
* Node.js (version 12.x or newer)

And:
* Socket.IO
* Express
  
Which will be automatically installed via NPM when setting up.

### Executing program

To run and use thist system you should do the following simple steps:
* Download the source folder
* Open this directory in your terminal, and run the following command:
```
$ node server.js
```
* Connect in your web browser by connecting to http://localhost:4000
* To connect on other devices, find the IP address of the machine you run the system with
* Then connect using other devices by connecting to http://--insert_ip_address--:4000

## Description

Given the limited time frame of development, my project is intentionally straightforward yet fully functional, emphasising simplicity and user accessibility. The system revolves around a singular webpage, allowing for effortless user interaction.

Users can currently create up to four distinct lobbies, which are accessible from various devices and updated in real time. Each lobby supports a maximum of five participants. The system is designed to display error messages for several constraints, such as exceeding the lobby limit or attempting to add too many players to a lobby. Duplicate lobby names or adding players with identical names to a lobby are also prevented.

The interface is designed for ease of use, featuring interactive buttons for user and lobby management, along with visual colouring to indicate game commencement. A notification panel, added by request, provides real-time updates on lobby changes to all players.

## Backend Development

For the backend development, I used Node.js along with the Express framework and Socket.IO to fulfill the technical requirements.

**Node.js and Express**: I set up a basic web server using Express. The server handles incoming HTTP requests and serves static files to the client, ensuring that the system is accessible via web browser.

**Socket.IO for Real-Time Communication**: I employed real-time updates through using Socket.IO. This library enables real-time, bidirectional communication between web clients and the server over WebSockets. All events on the lobbies are instantly communicated to all connected clients, ensuring that everyone's view is up-to-date.

**In-Memory Data Storage**: Instead of using an external database, I used in-memory data structures to store lobby and player information. This helped with speed and simplicity. The 'lobbies' object acts as the main data storage for the lobbies and players. 

**Handling Connections and Lobby Management**: When a user connects, the server uses Socket.IO to listen for events such as creating or joining a lobby. It checks for the specific constraints also. If an action is valid, it updates the 'lobbies' data structure and broadcasts the change to all clients.

**Limiting Lobbies and Players**: To maintain manageability and performance, I imposed limits on the number of active lobbies and the number of players in each lobby. The system can support up to four lobbies at any given time, with each lobby accommodating a maximum of five players. This decision was primarily to simplify the program, allowing a focus on its functionality. Displaying only four lobbies was the simplest approach for the frontend development on a single webpage.

## Future Ideas

1. Data Storage: Using a database like SQL could allow retention of lobby and player data, even if the server restarts. This would enable players to return to their lobbies without losing progress.

2. User Authentication: Implementing a simple user login system would give a personalised experience. Players could have profiles, track game history, and secure their lobbies with passwords.

3. Chat Functionality: I could add a chat feature in each lobby to allow players to communicate in real time. This could build a community and make coordinating games easier.

4. Mobile App: Developing a mobile app or site for the system would increase accessibility, enabling players to join or manage lobbies on the go.

## Authors

- [Joseph Nicol](https://www.linkedin.com/in/joenicol/)
