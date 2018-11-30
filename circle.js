/**
 *   Author  : Rasmus Wissing Kallehauge
 *   Email   : rkallehauge@gmail.com
 *   Created : Nov 5, 2018, 12:25:35 PM 
 */

window.addEventListener('load', ()=> {

    var canvas = document.getElementById('canvas');
    var main = document.getElementsByTagName('main')[0];
    
    var h = main.offsetHeight;
    var w = main.offsetWidth;
    
    
    canvas.height = h;
    canvas.width = w;
    console.log(w, h);
    var c = canvas.getContext('2d');
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    var mouse = {   
        x : undefined,
        y : undefined
    };
    var minRadius = 5;
    var maxRadius = 50;
    
    function randomColor(){
    var r,g,b;
    r = Math.floor(Math.random()*256);
    g = Math.floor(Math.random()*256);
    b = Math.floor(Math.random()*256);
    
    return "rgb(" + r + "," + g + "," + b + ")";
}

function Circle(x, y, xVel, yVel, radius, number, w, h){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.minRadius = radius;
    this.maxRadius = minRadius * 10;

    this.w = w;
    this.h = h;

    this.gravity = 200; // Pixel influence radius of mouse / circle.
    this.magnitude = 0.1;
    
    this.number = number;
    
    this.color = randomColor();
    
    this.speed = 1;
    
    this.draw = () => {
        
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        
        
        c.fillStyle = this.color;
        c.fill();
        
        
        
    }
    
    this.invert = (min,max,num) => {
        if(num<0){
            max*=-1;
        }
        return (max-min) - num;
    }
    
    
    this.update = () => {
        
        if((this.x + this.radius) > this.w || (this.x - this.radius) < 0){
            this.xVel *= -1;
        }
        
        if((this.y + this.radius) > this.h || (this.y - this.radius) < 0){
            this.yVel *= -1;
        }
        
        if(mouse.x - this.x < this.gravity && mouse.x - this.x > - this.gravity && mouse.y - this.y < this.gravity && mouse.y - this.y > - this.gravity){
            
            /* Cool feature that would be cool if it worked (better).
            var subX = (mouse.x - this.x) / this.gravity;
            var subY = (mouse.y - this.y) / this.gravity;
            
            var min, max;
            min = 0;
            max = radius;
            
            subX = this.invert(min, max, subX);
            subY = this.invert(min, max, subY);
            
            subX *= this.magnitude;
            subY *= this.magnitude;
            
            var vector = {x:subX, y:subY};
            
            this.xVel = vector.x;
            this.yVel = vector.y;
            */
        } else if(this.radius > this.minRadius){
            this.radius--;
            this.speed = 1;
        }
        
        
        this.x += (this.xVel * this.speed);
        this.y += (this.yVel * this.speed);
        
        this.draw();
    }
    
}

var circles = [];


for(var i = 0; i < 100; i++){
    
    var radius = Math.random() * 5 + 5  ;
    
    var x = ((Math.random() * (w - radius * 2)) + radius);
    var y = ((Math.random() * (h - radius *2 )) + radius);
    
    
    // 2 to 10
    var xVel = (Math.random() * 4) - 2;
    var yVel = (Math.random() * 4) - 2;
    
    
    var myCircle = new Circle(x, y, xVel, yVel, radius, i, w, h);
    
    circles.push(myCircle);
}

function animate(){
    
    
    //c.clearRect(0,0,innerWidth,innerHeight);
    
    for(var i = 0; i < circles.length; i++){
        circles[i].update();
    }
    
    //    c.beginPath();
    //    c.arc(x,y, radius, 0, Math.PI * 2, false);
    //    c.strokeStyle = "blue";
    //    c.stroke();
    
    requestAnimationFrame(animate);
}

animate();

});