const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let gameState = {
    players: {},
    items: {
        weapon: { x: 0.5, y: 0.5, active: true },
        life: { x: 0.2, y: 0.2, active: true }
    }
};

function spawnItem(type) {
    gameState.items[type].x = Math.random() * 0.8 + 0.1;
    gameState.items[type].y = Math.random() * 0.8 + 0.1;
    gameState.items[type].active = true;
}

io.on('connection', (socket) => {
    gameState.players[socket.id] = {
        x: 0.5, y: 0.5,
        health: 100, hasWeapon: false
    };

    socket.on('gyroData', (data) => {
        let p = gameState.players[socket.id];
        if (p) {
            // Gyro hassasiyeti (0.003 - 0.005 arası idealdir)
            p.x = Math.max(0, Math.min(1, p.x + (data.gamma || 0) * 0.001));
            p.y = Math.max(0, Math.min(1, p.y + (data.beta || 0) * 0.001));
            checkCollisions(socket.id);
        }
    });

    socket.on('disconnect', () => delete gameState.players[socket.id]);
});

function checkCollisions(id) {
    let p = gameState.players[id];
    
    // Item Toplama
    ['life', 'weapon'].forEach(type => {
        let item = gameState.items[type];
        if (item.active && Math.hypot(p.x - item.x, p.y - item.y) < 0.05) {
            if (type === 'life') p.health = Math.min(100, p.health + 20);
            else {
                Object.values(gameState.players).forEach(pl => pl.hasWeapon = false);
                p.hasWeapon = true;
            }
            item.active = false;
            setTimeout(() => spawnItem(type), 5000);
        }
    });

    // Oyuncu Savaşı
    Object.keys(gameState.players).forEach(oid => {
        if (id !== oid) {
            let other = gameState.players[oid];
            if (Math.hypot(p.x - other.x, p.y - other.y) < 0.06) {
                if (p.hasWeapon) other.health -= 0.5;
                if (other.hasWeapon) p.health -= 0.5;
                if (p.health <= 0) respawn(id);
                if (other.health <= 0) respawn(oid);
            }
        }
    });
}

function respawn(id) {
    let p = gameState.players[id];
    if(p) {
        p.health = 100; p.x = Math.random(); p.y = Math.random();
        if (p.hasWeapon) { p.hasWeapon = false; spawnItem('weapon'); }
    }
}

setInterval(() => io.emit('stateUpdate', gameState), 16);

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));