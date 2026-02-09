let socket, players = {}, items = {};
let blueSprites = [], redSprites = [];
let weaponSprite;
let heartSprite;

function preload() {
    // loading image sprites
    blueSprites = [loadImage('assets/blue1.png'), loadImage('assets/blue2.png')];
    redSprites = [loadImage('assets/red1.png'), loadImage('assets/red2.png')];
    weaponSprite = loadImage('assets/weapon.png');
    heartSprite = loadImage('assets/heart.png');
}

function setup() {
    // creating canvas
    createCanvas(windowWidth, windowHeight);
    // connecting to server and setting up listeners
    socket = io();
    socket.on('stateUpdate', data => {
        items = data.items;
        syncPlayers(data.players);
    });
}

function syncPlayers(serverPlayers) {
    // This function syncs the local players object with the server's player data
    for (let id in serverPlayers) {
        if (!players[id]) {
            let isMe = (id === socket.id);
            // if it's the current player, use blue sprites; otherwise, use red sprites
            let img1 = isMe ? blueSprites[0] : redSprites[1]; // blue1.png
            let img2 = isMe ? blueSprites[1] : redSprites[1]; // blue2.png

            if (!isMe) {
                img1 = redSprites[0];
                img2 = redSprites[1];
            }

            // Create new player instance
            players[id] = new Player(serverPlayers[id].x, serverPlayers[id].y, img1, img2);
        }
        // Update existing player data
        players[id].update(serverPlayers[id]);
    }
    
    // Remove players that are no longer in the server data
    for (let id in players) {
        if (!serverPlayers[id]) delete players[id];
    }
}

function draw() {
    background(200);

    // Drawing collectibles
    if (items.weapon?.active)
        drawAsset(items.weapon, true);
    if (items.life?.active) 
        drawAsset(items.life, false);

    // Drawing players
    for (let id in players)
        players[id].show();

    // Sending gyro data to server
    socket.emit('gyroData', { beta: rotationX, gamma: rotationY });

    // Logging player count
    if (socket)
        console.log("Connected Players:", Object.keys(players).length);    
}

// This function draws either a weapon or a heart based on the item data
function drawAsset(item, isWeapon) {
    push();
    let x = item.x * width;
    let y = item.y * height;
    translate(x,y)
    if (isWeapon)
        image(weaponSprite,0,0,width*0.1,width*0.1)
    else
        image(heartSprite,0,0,width*0.1,width*0.11)
    pop();
}

class Player {
    constructor(x, y, image1, image2) {
        // Initialize player properties
        this.x = x;
        this.y = y;
        this.image1 = image1;
        this.image2 = image2;      
        this.angle = 0;
        this.randomOffset = random(1000);
        this.health = 100;
        this.hasWeapon = false;
        this.weaponAngle = 0;
        this.hasHeart = false;
    }

    update(data) {
        // Update player properties based on server data
        let dx = data.x - this.x;
        let dy = data.y - this.y;
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001)
            this.angle = atan2(dy, dx);
        this.x = data.x;
        this.y = data.y;
        this.health = data.health;
        this.hasWeapon = data.hasWeapon;
    }

    show() {
        // Draw the player with rotation and animation
        push();
        translate(this.x * width, this.y * height);
        rotate(this.angle);
        imageMode(CENTER);
        // Alternate between two images for simple animation
        let frameIdx = ceil((frameCount + this.randomOffset) * 0.1);
        let img = frameIdx % 2 ? this.image2 : this.image1;
        image(img, 0, 0, width * 0.16, width * 0.16);
        // Rotate back to original orientation for weapon and health bar
        rotate(-this.angle);
        // If the player has a weapon, draw it with a rotation effect
        if (this.hasWeapon) { 
            rotate(this.weaponAngle);
            image(weaponSprite, 0, 0, width * 0.24, width * 0.24);
            rotate(-this.weaponAngle);
            this.weaponAngle += 0.02; // rotation speed
        }

        // Health Bar
        fill(255, 0, 0);
        rect(-25, -50, 50, 6);
        fill(0, 255, 0);
        rect(-25, -50, map(this.health, 0, 100, 0, 50), 6);
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}