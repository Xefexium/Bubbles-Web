/*jshint esversion: 6*/

//TODO begin work on hiring factories
//TODO find out why when you download something in another screen, the bubbles go away
var canvas;
var context;
var bubbles = [];
var count = 0;
var rate = 0;
var carryOver = 0;
var countLabel;
var rateLabel;
const BUBBLES_TO_SAVE = 5000;
const MAX_BUBBLES_TO_DRAW = 500;

function init() {
    canvas = document.getElementById("bubbleCanvas");
    canvas.addEventListener('touchstart', preventZoom);
    canvas.addEventListener('click', userClick, false);
    context = canvas.getContext("2d");
    window.onload = window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    countLabel = document.getElementById("count");
    rateLabel = document.getElementById("rate");
    updateLabels();
}

function userClick() {
    drawOne();
    updateLabels();
}

function drawOne() {
    var xPos = Math.floor(Math.random() * document.body.clientWidth);
    var yPos = Math.floor(Math.random() * document.body.clientHeight);
    var r = Math.floor((Math.random() * 100) + 10);
    var c = getRandomColor();
    if (bubbles.length < BUBBLES_TO_SAVE) {
        bubbles.push({
            x: xPos,
            y: yPos,
            radius: r,
            color: c
        });
    }
    count++;
    context.beginPath();
    context.arc(xPos, yPos, r, 0, 2 * Math.PI);
    context.fillStyle = c;
    context.fill();
}

function drawMultiple() {
    if (carryOver > 1) {
        carryOver--;
        drawOne();
    }
    carryOver += rate % 1;
    for (var i = 0; i < rate - rate % 1; i++) {
        if (i < MAX_BUBBLES_TO_DRAW) {
            drawOne();
        } else {
            count += rate - MAX_BUBBLES_TO_DRAW;
            break;
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function buy(amount, r) {
    if (count < amount) {
        return;
    }
    count -= amount;
    rate += r;
    if (count < BUBBLES_TO_SAVE) {
        bubbles.splice(0, bubbles.length - count);
        redraw();
    }
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bubbles.length; i++) {
        context.beginPath();
        context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, 2 * Math.PI);
        context.fillStyle = bubbles[i].color;
        context.fill();
    }
    updateLabels();
}

function updateLabels() {
    countLabel.innerHTML = "Bubbles: " + Math.floor(count);
    rateLabel.innerHTML = "Bubbles/second: " + rate.toFixed(1);
}

function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1)
        return; // not double-tap

    e.preventDefault();
    e.target.click();
}

init();
setInterval(drawMultiple, 1000);
setInterval(updateLabels, 1000);
