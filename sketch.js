let grid;
let spacing = 20;
let cols, rows;
let path = [];
let spot;
let cnv;

let camX = 0;
let camY = 0;
let camZ = 0;
let speed = 10;

let song;

function preload() {
   song = loadSound("Violin.mp3");
 }

function mousePressed() {
  cnv.elt.focus();  
  if (!song.isPlaying()) song.loop();
}


function make3DArray(cols, rows, depth) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = new Array(depth);
    }
  }
  return arr;
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.elt.tabIndex = 0;   
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  depth = cols;
  background(51);
  // song.loop();
  grid = make3DArray(cols, rows, depth);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        grid[i][j][k] = new Spot(i, j, k);
        frameRate(10)
      }
    }
  }
  const cx = floor(cols / 2);
  spot = grid[cx][cx][cx];
  path.push(spot);
  spot.visited = true;
  // frameRate(1);
}

function isValid(i, j, k) {
  if (i < 0 || i >= cols || j < 0 || j >= rows || k < 0 || k >= depth) {
    return false;
  }
  return !grid[i][j][k].visited;
}

let lerpX = 0;
let lerpY = 0;
let lerpZ = 0;

function draw() {
  background(0);
  
  orbitControl();

  if (keyIsDown(87)) camZ += speed; // W
  if (keyIsDown(83)) camZ -= speed; // S
  if (keyIsDown(65)) camX += speed; // A
  if (keyIsDown(68)) camX -= speed; // D
  if (keyIsDown(81)) camY += speed; // Q up
  if (keyIsDown(69)) camY -= speed; // E down
    translate(camX, camY, camZ);

  let center = createVector(0, 0, 0);
  let minXYZ = createVector(Infinity, Infinity, Infinity);
  let maxXYZ = createVector(0, 0, 0);
  for (let v of path) {
    minXYZ.x = min(v.x, minXYZ.x);
    minXYZ.y = min(v.y, minXYZ.y);
    minXYZ.z = min(v.z, minXYZ.z);
    maxXYZ.x = max(v.x, maxXYZ.x);
    maxXYZ.y = max(v.y, maxXYZ.y);
    maxXYZ.z = max(v.z, maxXYZ.z);
  }

  center.x = (maxXYZ.x - minXYZ.x) * 0.5 + minXYZ.x;
  center.y = (maxXYZ.y - minXYZ.y) * 0.5 + minXYZ.y;
  center.z = (maxXYZ.z - minXYZ.z) * 0.5 + minXYZ.z;

  const amt = 0.05;
  lerpX = lerp(lerpX, center.x, amt);
  lerpY = lerp(lerpY, center.y, amt);
  lerpZ = lerp(lerpZ, center.z, amt);
  //orbitControl();
  // translate(-spacing * cols * 0.5, -spacing * rows * 0.5, -spacing * depth * 0.5);
  translate(-lerpX, -lerpY, -lerpZ);
  // for (let i = 0; i < 500000; i++) {
  spot = spot.nextSpot();
  if (!spot) {
    let stuck = path.pop();
    stuck.clear();
    spot = path[path.length - 1];
  } else {
    path.push(spot);
    spot.visited = true;
  }

  if (path.length === cols * rows * depth) {
    console.log("Solved!");
    noLoop();
    // break;
  }
  //}

  stroke(255);
  strokeWeight(spacing * 0.1);
  noFill();

  colorMode(HSB);
  for (let i = 0; i < path.length - 1; i++) {
    let v1 = path[i];
    // path[i].x += random(-0.1,0.1);
    // path[i].y += random(-0.1,0.1);
    // path[i].z += random(-0.1,0.1);
    let v2 = path[i + 1];
    // let r = map(v1.i,0,cols,100, 255);
    // let g = map(v1.j,0,rows,100, 255);
    // let b = map(v1.k,0,depth,100, 255);
    // stroke(r,g,b);
    stroke((i + frameCount) % 360, 100, 100);

    line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
  }

  // beginShape();
  // for (let spot of path) {
  //   vertex(spot.x, spot.y, spot.z);
  // }
  // endShape();

  stroke(255);
  strokeWeight(spacing * 0.5);
  point(spot.x, spot.y, spot.z);
}

function resetSketch() {
  path = [];
  grid = make3DArray(cols, rows, depth);

  // Recreate all Spots
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        grid[i][j][k] = new Spot(i, j, k);
      }
    }
  }

  const cx = floor(cols / 2);
  spot = grid[cx][cx][cx];
  spot.visited = true;
  path.push(spot);

  loop();  // In case draw() was stopped
}

function keyPressed() {

  // save image
  if (key === 'k' || key === 'K') {
    save();
  }

  // restart
  if (key === ' ') {
    resetSketch();
  }
}
