# 🎮 Gyro Battle

A real-time multiplayer browser game built with **Node.js**,
**Express**, **Socket.IO**, and **p5.js**, where players move using
**device gyroscope input**, collect items, and battle each other in a
shared arena.

Players control their characters by tilting their devices, pick up
weapons and health items, and fight other connected players in real
time.

------------------------------------------------------------------------

## ✨ Features

- 📱 Gyroscope-based movement (requires a gyroscope-enabled device)
-   🌐 Real-time multiplayer using Socket.IO
-   🗺️ Shared game state synchronized across all clients
-   ⚔️ Weapon pickup system (only one weapon active at a time)
-   ❤️ Health pickup and regeneration
-   🔄 Automatic respawn system
-   🎨 Animated player sprites with health bars

------------------------------------------------------------------------

## 🎮 Gameplay Demo

[![Gameplay Demo](https://img.youtube.com/vi/7FvwzwCamyc/maxresdefault.jpg)](https://youtube.com/shorts/7FvwzwCamyc)

------------------------------------------------------------------------

## 🛠️ Tech Stack

**Server** - Node.js - Express - Socket.IO

**Client** - p5.js - Socket.IO Client - JavaScript (ES6)

------------------------------------------------------------------------

## 📂 Project Structure

    .
    ├── server.js          # Game server and real-time logic
    ├── public/
    │   ├── sketch.js      # Client-side game logic (p5.js)
    │   ├── assets/        # Player sprites, weapon, heart images
    │   └── index.html     # Game entry point
    └── README.md

------------------------------------------------------------------------

## 🚀 Getting Started

### 1️⃣ Install Dependencies

Make sure you have **Node.js** installed, then run:

``` bash
npm install express socket.io
```

------------------------------------------------------------------------

### 2️⃣ Run the Server

``` bash
node server.js
```

The server will start on:

    http://localhost:3000

(Or the port specified by `process.env.PORT`.)

------------------------------------------------------------------------

### 3️⃣ Play the Game

-   Open the game URL in multiple browser windows or devices
-   For best experience, use mobile devices with gyroscope support
-   Tilt your device to move your character
-   Collide with items and other players to interact

------------------------------------------------------------------------

## 🎯 Gameplay Mechanics

### Movement

-   Player position updates are driven by gyroscope rotation (`beta` and
    `gamma`)
-   Movement is clamped to stay within the game area

### Items

-   **❤️ Life Item**\
    Restores health (up to max 100)

-   **⚔️ Weapon Item**\
    Grants damage ability\
    Only **one player can hold the weapon at a time**

Items respawn automatically after a short delay.

### Combat

-   Players take damage when colliding
-   Weapon holders deal damage on contact
-   Players respawn with full health when defeated

------------------------------------------------------------------------

## 👥 Authors

-   Tahsin Enes Kuru
-   Kate Sim Read

------------------------------------------------------------------------

## 📌 Notes

-   Designed for mobile browsers
-   Game state updates are sent \~60 times per second for smooth
    gameplay
