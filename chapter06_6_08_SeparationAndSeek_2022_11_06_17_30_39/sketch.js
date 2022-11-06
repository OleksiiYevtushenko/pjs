// Separation
// Daniel Shiffman <http://www.shiffman.net>
// The Nature of Code, 2011

// https://natureofcode.com/book/processingjs/chapter06/_6_08_SeparationAndSeek/Vehicle.pde 
// https://natureofcode.com/book/processingjs/chapter06/_6_08_SeparationAndSeek/_6_08_SeparationAndSeek.pde
// Via Reynolds: http://www.red3d.com/cwr/steer/

// A list of vehicles
var vehicles;

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();

  // We are now making random vehicles and storing them in an ArrayList
  vehicles = [];
  for (let i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  
  //console.log(vehicles.length)
}

function draw() {
  background(0);

  for (let i = 0; i < vehicles.length; i++) {
    let v = vehicles[i];

    // Path following and separation are worked on in this function
    v.applyBehaviors(vehicles);
    // Call the generic run method (update, borders, display, etc.)
    v.update();
    v.display();
  }

  // Instructions
  fill(0);
  text("Drag the mouse to generate new vehicles." + vehicles.length, 10, height - 16);
}

function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}
