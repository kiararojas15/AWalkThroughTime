let c = 0;
let song;

function preload() {
  song = loadSound("Violin.mp3");
}
function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  song.loop();
}

function draw() {
  background(c, 100, 100);
  
  c = c + 0.1;
  if (c > 360) c = 0;
  
  text("Music by Eric Matyas, www.soundimage.org", 80, 380)
}