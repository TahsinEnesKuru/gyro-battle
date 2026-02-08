class Player {
  constructor(posX, posY, rotX, rotY) {
    this.posX = posX;
    this.posY = posY;
    this.rotX = rotX;
    this.rotY = rotY;
  }



  update() {
  // movement based on rotationX, rotationY
  const dx = constrain(rotY, -3, 3);
  const dy = constrain(rotX, -3, 3);
  cx += dx*2;
  cy += dy*2;
  cx = constrain(cx, 0, width);
  cy = constrain(cy, 0, height);
  ellipse(cx, cy, 20, 20);
  }

  display() {

  }

}
