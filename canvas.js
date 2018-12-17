var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var okHandImg = document.createElement("img");
okHandImg.setAttribute('src', 'https://png.pngtree.com/element_origin_min_pic/16/11/22/d8867a7e330ad30040da1ae2550282f9.jpg');
var score = 0;

var maxRadius = 50;
var minRadius = 4;
var mousePos = {
    x: undefined,
    y: undefined
}
var collapseCircleArea = {
    top: 100,
    bottom: 100,
    left: 150,
    right: 150
}

var colorArray = [
    "#e48d2c",
    "#b96332",
    "#f3e056",
    "#5f5e5c"
];

window.addEventListener('mousemove', function(event) {
    mousePos.x = event.x;
    mousePos.y = event.y;
});

function AnimatedText (x, y, text, font) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;

    this.draw = function () {
        c.font = this.font;
        c.fillText(this.text, this.x, this.y);
    }

    this.editText = function (text) {
        this.text = text;
    }
}

var lblScore = new AnimatedText(50, 50, "Score: 0", "50px Arial");

var circleArray = [];
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
        var i = circleArray.indexOf(this);
        circleArray.splice(i, 1);
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
             score += (this.colSpeed - this.exSpeed);
             lblScore.editText("Score: " + Math.abs(score).toString());
             this.remove();
        }

        this.draw();
    }
}

function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight); // Clear the canvas
    

    c.drawImage(okHandImg, (innerWidth / 2) - (okHandImg.width / 2), 
                innerHeight - okHandImg.height);

    circleArray.forEach(function(circle) {
        circle.update();
    });

    lblScore.draw();
}

animate();