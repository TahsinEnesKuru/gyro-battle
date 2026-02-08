let socket, players = {}, items = {};
let blueSprites = [], redSprites = [];

function preload() {
    blueSprites = [loadImage('assets/blue1.png'), loadImage('assets/blue2.png')];
    redSprites = [loadImage('assets/red1.png'), loadImage('assets/red2.png')];
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    socket = io();
    socket.on('stateUpdate', data => {
        items = data.items;
        syncPlayers(data.players);
    });
}

function syncPlayers(serverPlayers) {
    for (let id in serverPlayers) {
        if (!players[id]) {
            let isMe = (id === socket.id);
            let img1 = isMe ? blueSprites[0] : redSprites[0];
            let img2 = isMe ? blueSprites[1] : redSprites[1];
            players[id] = new Player(serverPlayers[id].x, serverPlayers[id].y, img1, img2);
        }
        players[id].update(serverPlayers[id]);
    }
    for (let id in players) if (!serverPlayers[id]) delete players[id];
}

function draw() {
    background(20);
    
    // Itemları Çiz
    if (items.weapon?.active) drawAsset(items.weapon, 'gold', true);
    if (items.life?.active) drawAsset(items.life, '#00ff00', false);

    // Oyuncuları Çiz
    for (let id in players) players[id].show();

    // Giriş Verisi Gönder
    socket.emit('gyroData', { beta: rotationX, gamma: rotationY });
}

function drawAsset(item, col, isWeapon) {
    push();
    fill(col);
    noStroke();
    let x = item.x * width;
    let y = item.y * height;
    if (isWeapon) triangle(x, y - 15, x - 15, y + 15, x + 15, y + 15);
    else rect(x - 10, y - 10, 20, 20);
    pop();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }