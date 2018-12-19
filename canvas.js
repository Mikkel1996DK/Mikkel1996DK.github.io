var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var backgroundImg = document.createElement("img");

var imageArray = [
    "https://i.redd.it/1iwcit1gidyy.jpg", // Vaporwave
    "https://wallpaperaccess.com/full/119615.jpg", // Beach
    "https://i.imgur.com/let82Vr.jpg", // Space
    "https://www.hdwallpapers.in/download/military_soldiers_4k-wide.jpg", // Soldiers
    "https://i.pinimg.com/originals/fb/19/87/fb198758d12be1f7cb70ef3164673683.jpg", // City
    "https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/f47HLdl/4k-timelapse-of-active-fuego-volcano-in-guatemala-at-sunrise_he11kebv__F0000.png" // Sky
];

var themeNumber = Math.floor(Math.random() * imageArray.length);

var masterColorArray = [
    ["#2D796A", "#022F2E", "#E211E5", "#011353"], // Vaporwave
    ["#0A699E", "#E6C37C", "#DEE7F6", "#283519"], // Beach
    ["#BFFAFE", "#13212E", "#58AAE2", "	#1C414A"], // Space
    ["#FFC141", "#441E00", "#A05D04", "##AA740C"], // Soldiers
    ["#FF882F", "#0A3F54", "#A9ADA8", "#3E3F40"], // City
    ["#FFD1B9", "#6B3F45", "#FFF4D0", "#39476C"], // Sky
];

backgroundImg.setAttribute('src', imageArray[themeNumber]);

var colorArray = masterColorArray[themeNumber];

var score = 0;

var maxRadius = 50;
var minRadius = 4;
var mousePos = {
    x: undefined,
    y: undefined
}
var collapseCircleArea = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50 
}

window.addEventListener('mousemove', function(event) {
    mousePos.x = event.x;
    mousePos.y = event.y;
});

function AnimatedText (x, y, text, font, fillStyle) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.fillStyle = fillStyle;

    this.draw = function () {
        c.fillStyle = this.fillStyle;

        c.font = this.font;

        c.lineWidth = 1;
        c.fillText(this.text, this.x, this.y);
    }

    this.editText = function (text) {
        this.text = text;
    }
}

var lblScore = new AnimatedText(50, 50, "Score: 0", "50px Arial", colorArray[2]);

var circleArray = new Array();
for (var i = 0; i < 500; i++) {
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2)+ radius;
    var dx = (Math.random() - 0.7);
    var dy = (Math.random() - 0.7);
    var radius = maxRadius;
    var color = colorArray[Math.floor(Math.random() * colorArray.length)];
    var colSpeed = (Math.floor(Math.random() * 6) + 2)
    var exSpeed = 3;
    circleArray.push(new AnimatedCircle(x, y, radius, color, dx, dy, colSpeed, exSpeed));
}



function AnimatedCircle (x, y, radius, strokeStyle, dx, dy, colSpeed, exSpeed) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.strokeStyle = strokeStyle;
    this.colSpeed = colSpeed;
    this.exSpeed = exSpeed;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.strokeStyle;
        c.strokeStyle = this.strokeStyle;
        c.stroke();
        c.fill();
    }

    this.remove = function () {
        var newCircleArray = Array();
        for (var i = 0; i < circleArray.length; i++) {
            if (circleArray[i] != this) {
                newCircleArray.push(circleArray[i])
            }
        }

        circleArray = newCircleArray;
    }

    this.update = function () {
        if ((this.x + this.radius) > innerWidth || (this.x - this.radius) < 0) {
            this.dx = -this.dx;
        }
    
        if ((this.y + this.radius) > innerHeight || (this.y - this.radius < 0)) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        if (mousePos.x - (collapseCircleArea.left) < this.x 
        && mousePos.x + (collapseCircleArea.right) > this.x 
        && mousePos.y - (collapseCircleArea.top) < this.y 
        && mousePos.y + (collapseCircleArea.bottom) > this.y) {
            if (this.radius > minRadius) {
                this.radius -= this.colSpeed;
            }
        } else if (this.radius < maxRadius) {
            this.radius += this.exSpeed;
        }

        if ((mousePos.x > this.x - (this.radius / 2) 
         || mousePos.x < this.x + (this.radius / 2)
         || mousePos.y > this.y - (this.radius / 2)
         || mousePos.y < this.y + (this.radius / 2))
         && this.radius <= minRadius) {
            this.colSpeed = -this.colSpeed;
            this.exSpeed = -this.exSpeed;
            score += 1;
             lblScore.editText("Score: " + score.toString());
             this.remove();
        }

        this.draw();
    }
}

function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight); // Clear the canvas
    

    c.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height,
                               0, 0, canvas.width, canvas.height);
    circleArray.forEach(function(circle) {
        circle.update();
    });
    
    lblScore.draw();
}

animate();