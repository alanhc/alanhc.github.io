// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/-GEVHlOjR/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

function classifyVideo()
{

}


// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(320, 260);
    // Create the video
    video = createCapture(VIDEO);
    video.size(1000, 800);
    video.hide();

    flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();
}

function draw() {
    background(0);
    
    image(video, 0, 0);
    
}