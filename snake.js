/**
 *   Author  : Rasmus Wissing Kallehauge
 *   Email   : rkallehauge@gmail.com
 *   Created : Nov 5, 2018, 2:14:31 PM 
 */
 
var canvas = document.getElementById('canvas');
canvas.style.border = "1px solid #ccc";
var w,h;

var parent = document.getElementById('game-container');

console.log(parent);

w = parent.offsetWidth;
// Set canvas height to 70 percent of viewport height
parent.style.height = h = $(window).height() * 0.70;



canvas.width = w;
canvas.height = h;

var fps = 5; // easy 5, normal 8, hard 12, extreme 16

var c = canvas.getContext('2d');
var blockSize = 25;

var myGame = new Game(blockSize, c);

function Game(blockSize, renderer){
    
    this.blockSize = blockSize;
    this.c = renderer;
    
    this.width  = Math.floor(w / this.blockSize);  
    this.height = Math.floor(h / this.blockSize); 
    
    this.map = [];
    this.food = [];
    
    this.ended = 0;

    this.gameStopped = false;
    this.pauseMessage = 'Paused';
    
    for(var i = 0; i < this.width; i++){
        var x = []; 
        for(var j = 0; j < this.height; j++){
            x.push(0);
        }
        this.map.push(x);
    }
    
    // Start in the middle and move left.
    var startX = Math.floor(this.width / 2);
    var startY = Math.floor(this.height / 2);
    
    var startDX = 1;
    var startDY = 0;
    
    var startLength = 5;
    
    this.player = new Snake(startX, startY, startDX, startDY, startLength);
    
    this.spawnFood = () => {
        console.log('Spawning food');
        var coords = this.randomCoordinates();

        console.log('Spawned food at:',coords[0],coords[1]);
        this.map[coords[0]][coords[1]] = 1;
        
        console.log([coords[0], coords[1]]);
        this.food.push([coords[0], coords[1]]);
        
    }
    
    this.drawFood = () => {
        for(var i = 0; i < this.food.length; i++){
            this.drawBlock(this.food[i][0], this.food[i][1], '#f00');
        }
    }
    
    this.drawBlock = (x,y,color) => {
        
        x *= blockSize;
        y *= blockSize;
        
        //console.log(x + " " + y);
        this.c.fillStyle = color;
        
        
        this.c.fillRect(x, y, blockSize, blockSize);
    }
    
    this.update = () => {
        if(this.gameStopped){

            this.c.fillStyle = '#000';
            this.c.fillRect(0, 0, w, h);
            this.c.fillStyle = '#fff';

            this.c.font="200% Arial";
            
            this.c.strokeStyle = "#000";
            this.c.strokeText(this.pauseMessage, w/2, h/2);
            this.c.fillText(this.pauseMessage, w/2, h/2);
            
        } else{
            
            this.c.fillStyle = '#000';
            this.c.fillRect(0, 0, w, h);
            
            this.drawFood();
            this.player.move();   
        }
    }
    
    this.move = (e) => {
        var key = e.key.toLowerCase();
        this.player.turn(key);
        
    }
    
    this.randomCoordinates = () => {
        var iterations = 0;
        while(true){
            i++;
            var match = false;
            var x = Math.floor( Math.random() * this.width);
            var y = Math.floor( Math.random() * this.height);
            // Can't return coordinate inside player body or player head.
            for(var i = 0; i < this.player.body.length; i++){
                if(this.player.body[i]['x'] === x && this.player.body[i]['y'] === y){
                    match = true;
                    break;
                }
            }
            if(match){
                // The search [continue]s
                continue;
            }
            if(this.player.x === x && this.player.y === y){
                // The search [continue]s
                continue;
            }
            // if there already is food at given location
            // C0nt1nu3 xx.....
            if(this.map[x][y] === 1){
                continue;
            }
            if(iterations>1000){
                // Game map is ((probably)) saturated, just return some coordinates.
                return [0,0];
            }
            break;
        }
            return [x,y];
        }
        
        this.gameOver = () => {
            this.gameStopped = true;
            this.ended = 1;
            this.pauseMessage = 'Game Over, score: ' + this.player.length;
        }
    
        // Initialize food 
        this.spawnFood();

}

function Snake(x, y, dx, dy, length){
    
    this.length = length;
    
    this.x = x;
    this.y = y;

    this.safePos = {
        x: undefined,
        y: undefined
    };
    
    this.dx = dx;
    this.dy = dy;
    
    // this.body[n][x & y]
    
    this.body = [];
    
    // Maybe create different body depending on starting velocities?
    for(var i = 0; i < this.length; i++){
        
        var arr = [];
        arr['x'] = (this.x-(i+1));
        arr['y'] = this.y;
        arr['status'] = "old";
        arr['start'] = [this.x, this.y];

        this.body.push(arr);
    }
    
    this.notInSafeSpace = () => {
        return (this.x !== this.safePos.x) || (this.y !== this.safePos.y);
    }   

    // SPOOKY CODE | SPAGHETTI CODE
    this.turn = (key) => {
        
        switch(key){
            case 'a':
            case 'arrowleft':    
            if(this.dx !== 1 && this.notInSafeSpace()){
                this.dx = -1;
                this.dy = 0;
            }
            break;
            
            case 'd':
            case 'arrowright':    
            if(this.dx !== -1 && this.notInSafeSpace()){
                this.dx = 1;
                this.dy = 0;
            }
            break;
            
            case 'w':
            case 'arrowup':
            if(this.dy !== 1 && this.notInSafeSpace()){
                    this.dy = -1;
                    this.dx = 0;
                }
                break;
                
            case 's':
            case 'arrowdown':
            if(this.dy !== -1 && this.notInSafeSpace()){
                this.dy = 1;
                this.dx = 0;
            }
            break;
            
            
            // Pause game
            case 'p':
            case 'escape':
            if(!myGame.ended){
                myGame.gameStopped = !myGame.gameStopped;
            }
            break;
            
            // Reset game
            case 'r':
            myGame = new Game(blockSize, c);
            break;
            
            
            default:
            console.log(key);
            break;
            
        }

        switch(key){
            case 'w':
            case 'arrowup':
            case 'a':
            case 'arrowleft':
            case 's':
            case 'arrowdown':
            case 'd':
            case 'arrowright':
                this.safePos.x = this.x;
                this.safePos.y = this.y;
            break;
        }

    }
    
    this.move = () => {
            
            for(var i = this.body.length-1; i >= 0; i--){
                
                if(i===0){
                    this.body[i]['x'] = this.x;
                    this.body[i]['y'] = this.y;
                }
                else {
                        this.body[i]['x'] = this.body[i-1]['x'];
                        this.body[i]['y'] = this.body[i-1]['y'];

                        if(this.body[i]['status'] == 'new'){
                            if(this.body[i]['start']['x'] != this.body[i]['x'] && this.body[i]['start']['y'] != this.body[i]['y']){
                                this.body[i]['status'] = 'old';       
                        }
                    }
                }
                
                // Draw body element
            myGame.drawBlock(this.body[i]['x'], this.body[i]['y'], "#fff");
        }
 
            this.x += this.dx;
            
            if(this.x > myGame.width || this.x < 0){
                if(this.x > myGame.width){
                    this.x = 0;
                }
                else{
                    this.x = myGame.width;
                }
            }

            this.y += this.dy;
            
        if(this.y > myGame.height || this.y < 0){
            if(this.y > myGame.height){
                this.y = 0;
            }
            else{
                this.y = myGame.height;
            }
        }
        
        // Food collision testing
        for(var i = 0; i < myGame.food.length; i++){
            if(this.x === myGame.food[i][0] && this.y === myGame.food[i][1]){
                this.eat(i);
            }
        }
        
        // Self collision testing
        for(var i = 0; i < this.body.length; i++){
            if(this.x == this.body[i].x && this.y == this.body[i].y && this.body[i]['status'] != 'new'){
                this.die();
            }
        }

        // Draw head
        myGame.drawBlock(this.x, this.y, '#fff');
    }

    this.eat = (index) => {
        
        var arr = [];
        arr['x'] = myGame.food[index][0];
        arr['y'] = myGame.food[index][1];
        arr['status'] = "new";
        arr['start'] = {'x':arr['x'], 'y':arr['y']};

        this.length++;

        // Remove food from food list
        myGame.food.splice(index,1);
        console.log("Hello ? ");
        myGame.spawnFood();
        
        this.body.push(arr);
        
    }
    
    this.die = () => {
        console.log(" O O F ");
        myGame.gameOver();
    }

}
function animate(){
    
    myGame.update();
}

document.addEventListener('keydown', function(e){
    myGame.move(e); 
});

frames = setInterval(function(){
    requestAnimationFrame(animate);
}, 1000 / fps);