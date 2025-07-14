//https://www.youtube.com/@Frankslaboratory/videos

class Game{
    constructor(canvas , context){

        this.smallFont = Math.ceil( 20 * this.ratio ) ;
        this.largeFont = Math.ceil( 45 * this.ratio ) ;
        //defining the canvas
        this.canvas = canvas;
        this.ctx = context;
        this.ctx.fillStyle;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        //the baseheight ( original height of screen )
        this.baseheight = 720;
        this.ratio = this.height / this.baseheight;  // a ratio to account for changes in there

        this.isdebugModeOn = false;
        this.isPaused = false;
        this.controls = new Controls(this);
        this.player = new Player(this); // player of the game

        this.background = new Background(this); // receiving the background image

        this.speed = 2*this.ratio;

        this.gravity = 1;  // defining the gravity

        this.obstacles = [];
        this.numberOfObstacles = 300;

        this.score = 0;
        this.timer = 0;
        this.gameOver = false;

        this.bottomMargin;

        this.message1;
        this.message2;

        this.eventTimer = 0;
        this.eventInterval = 150 ;
        this.eventUpdate = false;

        this.touchStartX;



        this.sound = new AudioControl();
        

        window.addEventListener( 'resize' , e=>{
            this.resize( e.currentTarget.innerWidth , e.currentTarget.innerHeight );
        });


        // mouse controls
        this.canvas.addEventListener( "mousedown" , e=>{
            this.player.flap();
            this.canvas.focus();

        });

        this.canvas.addEventListener( "mouseup" , e=>{
            setTimeout( ()=>{
                this.player.wingsUp();
            } , 50 );

        });


        //keyboard controls
        document.addEventListener( 'keydown' , e=>{
            if( e.key === ' ' || e.key === 'Enter'  || e.key === 'ArrowUp'){
                e.preventDefault();
                this.player.flap();
            }

            if(e.key === 'Shift' || e.key.toLowerCase()==='c'){
                this.player.startCharge();
            }
        });

        window.addEventListener( "keyup" , e=>{
            this.player.wingsUp();

        });


        //touch controls
        this.canvas.addEventListener( 'touchstart' , e=>{
            this.player.flap();
            this.touchStartX = e.changedTouches[0].pageX;
        });
        

        this.canvas.addEventListener( "touchmove" ,e => {
            e.preventDefault();
            if( e.changedTouches[0].pageX - this.touchStartX > 30 * this.ratio ){
                this.player.startCharge();
            }
        } );

        this.canvas.addEventListener( "touchend" ,e => {
            if( e.changedTouches[0].pageX - this.touchStartX > 30 * this.ratio  ){
                this.player.startCharge();
            }
            else{
                this.player.flap();
                setTimeout( ()=>{
                    this.player.wingsUp();
                } , 50 );
            }
        } );
    }




    resize( width , height ){

        // resizing the canvas
        this.canvas.width = width ;
        this.canvas.height = height ;

        // this is needed because when resizing the parameters are reset so we have to reassign the color
        // however this place is optimal rather than doing the reassignment in animate() since its recursively called many times
        this.ctx.fillStyle ; // = "blue";
        
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'white' ; 
        // updates the width and height data members of the game class , the actual assignment happens in the earlier lines of this function
        // and that is dependent on the innerWidth and innerHeight received from the event variable in the event handler that is passed as arg to this function
        this.width = this.canvas.width;
        this.height = this.canvas.height;



        // updating the ratio as well
        this.ratio = this.height / this.baseheight;
        // console.log( "height : " , this.height , "Base height : " , this.baseheight , "Ratio : " , this.ratio );

        this.bottomMargin = Math.floor( 80 * this.ratio );
        this.smallFont = Math.ceil( 20 * this.ratio ) ;
        this.largeFont = Math.ceil( 45 * this.ratio ) ; 
        this.ctx.font = this.smallFont + 'px Bungee';
        this.gravity = 0.15 * this.ratio; // when the window is resized not adjusting gravity would cause the player object to fall down way too quick
        




        // resizing the player object 
        this.player.resize();

        // resizing the control panel
        this.controls.resize();

        this.ctx.textAlign = 'right';

        this.speed = this.ratio * 2;

        this.minSpeed = this.speed;
        this.maxSpeed = this.speed * 5;

        this.background.resize(); 

        this.canvas.focus();

        this.createObstacles();
        this.obstacles.forEach( obstacle => {
            obstacle.resize();
        });

        // this.score = 0;
        // this.timer = 0;
        // this.gameOver = false;
        // this.game.player.energy = this.game.player.minEnergy ; 
                


    }



    checkCollision( a , b ){
        let dx = a.collisionX - b.collisionX;
        let dy = a.collisionY - b.collisionY;
        let distance = Math.hypot( dx , dy );
        let sumOfRadii = a.collisionRadius + b.collisionRadius ;
        return distance <= sumOfRadii ;
    }


    handlePeriodicEvents(deltaTime){
        if( this.eventTimer < this.eventInterval ){
            this.eventTimer += deltaTime;
            this.eventUpdate = false;
        }

        else{
            this.eventTimer = this.eventTimer % this.eventInterval;
            this.eventUpdate = true ;
            // console.log('time');
        }
    }



    render( time ){
        // console.log( time );
        if(!this.gameOver) this.timer += time;

        // if(this.controls.debugModeOn) this.controls.debugMode();
        this.handlePeriodicEvents(time);
        this.background.update();
        this.background.draw();

        this.drawStatustext();

        this.player.update();
        this.player.draw();

        this.obstacles.forEach( obstacle =>{
            obstacle.update();
            obstacle.draw();
        });

    }


    createObstacles(){
        this.obstacles = [];
        const firstX = this.baseheight * this.ratio ;
        const obstacleSpacing = 600 * this.ratio ;
        for( let i = 0 ; i < this.numberOfObstacles ; i++ ){
            this.obstacles.push( new Obstacle(this , firstX + i*obstacleSpacing ) );
        }
    }

    formattedTime(){
        return (this.timer * 0.001).toFixed(1) ; 
    }

    triggerGameOver(){
        if(!this.gameOver){
            this.gameOver = true;
            if(this.obstacles.length <= 0){
                this.sound.play( this.sound.win );
                this.message1 = "Nailed it";
                this.message2 = "Can you do it faster than " + this.formattedTime() + " s";
            }
            else{
                this.sound.play( this.sound.lose );
                this.message1 = "Getting Rusty?";
                this.message2 = "Collision time " + this.formattedTime() + " s" ;
                
            }
        }
    }






    drawStatustext( ){

        this.ctx.save();

        this.ctx.fillText( "Score : " + this.score , this.width  - this.smallFont, this.largeFont);


        this.ctx.textAlign = 'left';
        this.ctx.fillText( "Timer : " + this.formattedTime() + " s" , this.smallFont , this.largeFont );

        if(this.gameOver){

            this.ctx.textAlign = 'center';
            this.ctx.font = this.largeFont + 'px Bungee';
  
            this.ctx.fillText( this.message1 , this.width * 0.5 , this.height * 0.5 - this.largeFont  , this.width);
            this.ctx.font = this.smallFont + 'px Bungee';
            this.ctx.fillText( this.message2 , this.width * 0.5 , this.height * 0.5  - this.smallFont , this.width);
            this.ctx.fillText( "Press 'R' to try again!" , this.width * 0.5 , this.height * 0.5  , this.width);

        }
        


        let energyRatio = (this.player.energy - this.player.minEnergy) / (this.player.maxEnergy - this.player.minEnergy);

        let r = Math.floor(255 * (1 - energyRatio));  // Red decreases as energy increases
        let g = Math.floor(255 * energyRatio);        // Green increases as energy increases
        this.ctx.fillStyle = `rgb(${r}, ${g}, 0)`;    // Gradual color from red to green


        for( let i = 0 ; i < this.player.energy ; i++ ){
            this.ctx.fillRect( 10 , (this.height - 10 - 2 * i) , 15 * (this.ratio + 0.1) , 2);
        }

        this.ctx.restore();
    }


}



window.addEventListener( 'load' , ()=>{
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;

    var game = new Game( canvas , ctx );

    game.resize( window.innerWidth , window.innerHeight );
    let lastTime = 0;

    function animate( timeStamp ){
        
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        if(game.controls.debugModeOn) game.controls.debugMode();
        if(!game.isPaused) game.render( deltaTime );
        requestAnimationFrame(animate);
  
    }

    if(!game.gameOver) {
        requestAnimationFrame(animate);
    }

    

    
});