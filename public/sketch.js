let redImg1, redImg2
let blueImg1, blueImg2

function setup() {
    createCanvas(windowWidth, windowHeight);
    socket = io();
    
}

function preload() {
    blueImg1 = loadImage('assets/blue1.png')
    blueImg2 = loadImage('assets/blue2.png')
    redImg1 = loadImage('assets/red1.png')
    redImg2 = loadImage('assets/red2.png')
}

function draw() {
    background(15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    // ios 13 device
    
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        let button = createButton("click to allow access to sensors");
        button.style("font-size", "24px");
        button.center();
        button.mousePressed( requestAccess );
        throw error;
      })
      .then(() => {
        // on any subsequent visits
        permissionGranted = true;
      })
  } else {
    // non ios 13 device
    textSize(48);
    // text("non ios 13 device", 100, 100);
    permissionGranted = true;
}