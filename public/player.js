class Player {
    constructor(x, y, image1, image2) {
        this.x = x; this.y = y;
        this.image1 = image1; this.image2 = image2;      
        this.angle = 0;
        this.randomOffset = random(1000);
        this.health = 100;
        this.hasWeapon = false;
    }

    update(data) {
        let dx = data.x - this.x;
        let dy = data.y - this.y;
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) this.angle = atan2(dy, dx);
        this.x = data.x;
        this.y = data.y;
        this.health = data.health;
        this.hasWeapon = data.hasWeapon;
    }

    show() {
        push();
        translate(this.x * width, this.y * height);
        rotate(this.angle);
        imageMode(CENTER);
        let frameIdx = ceil((frameCount + this.randomOffset) * 0.1);
        let img = frameIdx % 2 ? this.image2 : this.image1;
        image(img, 0, 0, width * 0.08, width * 0.08);

        if (this.hasWeapon) { 
            noFill(); stroke('gold'); strokeWeight(3); 
            ellipse(0, 0, width * 0.1); 
        }
        
        rotate(-this.angle);
        // Health Bar
        fill(255, 0, 0); rect(-25, -50, 50, 6);
        fill(0, 255, 0); rect(-25, -50, map(this.health, 0, 100, 0, 50), 6);
        pop();
    }
}