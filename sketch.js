
var emojis = [];
var maxIms = 10; 
var img;
var resize = 1;
var row = 0;
var col = 0;
var EMOJIS_SIZE = 16;
var locations = [];
var nEmojis = 5000;
var emojisJSON;

var repoDir = 'https://raw.githubusercontent.com/fepegar/emojis/master/';
var jsonPath = repoDir + 'emojis.json';


function Emoji(filepath) {
  this.filepath = filepath;
  
  this.loadImage = function() {
    this.img = loadImage(this.filepath);
  }
}


function preload() {
  
  emojisJSON = loadJSON('emojis.json');
  
  /*
  var filepath;
  nFiles = min(nEmojis, emojisJSON.length);  // If we want to limit the numbers of emojis for testing
  for(var i = 0; i < nFiles; i++) {
    filepath = 'images/' + emojisJSON[i].filename;
    print(filepath)
    img = loadImage(filepath);
    emojis.push(img);
  }
  */
  
  var filepath, filepaths = [];
  for(var i = 0; i < 29; i++) {
    for(var j = 0; j < 29; j++) {
      if(i > 4 && j == 28) continue;
      filepath = 'images/' + str(i) + '_' + str(j) + '.png';
      filepaths.push(filepath);
    }
  }
  
  var emoji;
  nFiles = min(nEmojis, filepaths.length);  // If we want to limit the numbers of emojis for testing
  for(var i = 0; i < nFiles; i++) {
    emoji = new Emoji(filepaths[i]);
    emoji.loadImage();
    emojis.push(emoji);
  }
  
  print('Loading ' + emojis.length + ' emojis...');
  img = loadImage('dunkerque.jpg');
}


function setup() {
  print(emojisJSON)
  noLoop();
  resizeEmojis();
  var emoji;
  for(var i = 0; i < emojis.length; i++) {
    emoji = emojis[i];
    emoji.img.loadPixels();
    emoji.meanRGB = getMeanColor(emoji.img.pixels);
  }
  
  img.resize(img.width * resize, img.height * resize);
  img.loadPixels();
  
  drawIt();
}


function drawIt() {
  t1 = millis();
  fillLocations();
  shuffle(locations, true);
  createCanvas(img.width, img.height)
  background(getMeanColor(img.pixels));
  
  var emoji;
  var col, row;
  for(var i = 0; i < locations.length; i++) {
    col = locations[i][0];
    row = locations[i][1];
    emoji = getClosestEmoji(img.get(col, row));
    image(emoji.img, col-EMOJIS_SIZE/2, row-EMOJIS_SIZE/2);  // shift to center emoji on pixel
  }
  saveCanvas('onlyOpaque.jpg', 'jpg');
  print('Time to draw it: ' + (millis() - t1)/1000);
}


function draw() {
  var emoji = getClosestEmoji(img.get(col, row));
  image(emoji, col, row);
  
  col += emoji.width;
  if(col >= img.width) {
    col = 0;
    row += emoji.height;
  }
  
  if(row >= img.height){
    noLoop();
  }
}


function fillLocations () {
  for(var row = 0; row < img.height; row += EMOJIS_SIZE/2) {
    for(var col = 0; col < img.width; col += EMOJIS_SIZE/2) {
      locations.push([col, row]);
    }
  }
}


function resizeEmojis() {
  for(var i = 0; i < emojis.length; i++) {
    emojis[i].img.resize(EMOJIS_SIZE,0);
  }
}


function keyPressed() {
  var x = random(width);
  var y = random(height);
  var c = img.get(x, y);
  var emoji = getClosestEmoji(c);
  //image(emojis[floor(random(emojis.length))], random(width), random(height));
  image(emoji, x, y);
}


function getMeanColor(pixels) {
  var r = [];
  var g = [];
  var b = [];
  
  for(var i = 0; i < pixels.length; i += 4) {
    if(pixels[i+3] === 0) continue;
    r.push(pixels[i]);
    g.push(pixels[i+1]);
    b.push(pixels[i+2]);
  }
  
  return color(mean(r), mean(g), mean(b));
}


function mean(arr) {
  return arr.reduce(function(a, b) { return a + b; }) / arr.length;
}


function euclideanDifference(color1, color2) {
  return sq(red(color2) - red(color1)) + sq(green(color2) - green(color1)) + sq(blue(color2) - blue(color1))
}

// TODO: read from JSON
function getClosestEmoji(c) {
  var minDiff = 10000000;
  var diff;
  var result;
  var meanColor;
  
  for(var i = 0; i < emojis.length; i++) {
    emoji = emojis[i]
    diff = euclideanDifference(c, emoji.meanRGB);
    if(diff < minDiff)
    {
      minDiff = diff;
      result = emoji;
    }
  }
  
  return result;
}


function createEmojisJSON() {
  var json = {};
  var emojiJSON;
  json.emojis = [];
  for(var i = 0; i < emojis.length; i++) {
    emojiJSON = {}; // new JSON Object
    emojiJSON.filepath = filepaths[i];
    emojis[i].loadPixels();
    emojiJSON.meanColorRGB = getMeanColor(emojis[i].pixels);
    json.emojis.push(emojiJSON);
  }
  json.id = 'lol'
  saveJSON(json, 'emojis.json')
}

