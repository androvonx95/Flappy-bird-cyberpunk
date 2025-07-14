class Player{
    constructor(game){
        this.game = game;
        this.x = 10;
        this.y = 10;

        this.spriteWidth = 200;
        this.spriteHeight = 200;

        this.width = 200;
        this.height = 200; 

        this.speedY;

        this.flapSpeed = 5 ;


        this.collisionX = this.x;
        this.collisionY = this.y;
        this.collisionRadius;

        this.collided = false ;

        this.energy = 30;
        this.maxEnergy = this.energy * 2;
        this.minEnergy = 15;
        this.charging;
        this.frameY;
        this.image = document.getElementById('player_fish');
        
    }

    draw(){
        // this.game.ctx.strokeRect( this.x , this.y , this.width , this.height );

        this.game.ctx.drawImage( this.image , 0 , this.frameY * this.spriteHeight , this.spriteWidth , this.spriteHeight ,  this.x , this.y , this.width , this.height );
        this.game.ctx.beginPath();

        if(this.game.isdebugModeOn){
            this.game.ctx.arc( this.collisionX + this.collisionRadius * 0.9 , this.collisionY , this.collisionRadius , 0 , Math.PI*2 );
        }
        // this.game.ctx.arc( this.collisionX + this.collisionRadius * 0.9 , this.collisionY , this.collisionRadius , 0 , Math.PI*2 );
        this.game.ctx.stroke();

    }

    update(){
        this.handleEnergy();

        if(this.speedY >= 0 ) this.wingsUp();
        this.y += this.speedY;
        this.collisionY = this.y + this.height * 0.5 ;

        this.game.ctx.beginPath();
         this.game.ctx.stroke();
        
        // coding gravity ...
        if(!isNaN(this.speedY) ){
            this.y+=this.speedY; 
        }
        // if the player is not touching the bottom of the screen we make them
        // do so by increasing the Y coordinate speed what has been set to y coordinate itself
        // this update() is recursively called by the requestAnimationFrames() function
        // so the speed gets updated and so it is set as value to this.y (y coordinate)
        if( !this.isTouchingBottom()  && !    this.charging ){
            this.speedY += this.game.gravity ; 
        }

        else{
            this.speedY = 0;
        }

        // bottom boundary to prevent falling through the bottom side of the screen
        if( this.isTouchingBottom() ){
            this.y = this.game.height - this.height - this.game.bottomMargin;
            this.wingsIdle();

        }


        // console.log("Y: " , this.y);
        // console.log("speed : " , this.speedY);
        // console.log("Flap speed : " , this.flapSpeed);

    }

    
    isTouchingBottom(){  
        // this should more approriately called its submerging because the 
        // condition only checks if it is touching the bottom layer and more importantly
        // submerging below the bottom layer
        return this.y >= this.game.height - this.height - this.game.bottomMargin;
    }

    isTouchingTop(){
        return this.y <=0;
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height =this.spriteWidth * this.game.ratio;

        this.y = 0.5*(this.game.height - this.height);   // this makes sure that the player object starts out at exactly half the window screen
        this.speedY = -4 * this.game.ratio; // setting the speed to -5 would mean that 

        this.flapSpeed = 5*this.game.ratio;

        this.collisionRadius = 40 * this.game.ratio ; //this.width *0.5;
        this.collisionX = this.x + this.width * 0.5 ;

        this.collided = false ;
        this.charging = false;
        this.frameY = 0;

    }

    startCharge(){
        if(this.energy >= this.minEnergy ){
            this.charging = true;
            this.game.speed = this.game.maxSpeed;
            this.wingsCharge();
            this.game.sound.charge.play( this.game.sound.charge );
        }
        else{
            this.stopCharge();
        }

    }

    stopCharge(){
        this.charging = false;
        this.game.speed = this.game.minSpeed;

    }



    wingsIdle(){
        if(!this.charging)this.frameY = 0;

    }

    wingsDown(){
        if(!this.charging)this.frameY = 1;
    }

    wingsUp(){
        if(!this.charging)this.frameY = 2;
    }

    wingsCharge(){
        this.frameY = 3;
    }





    handleEnergy(){

        if( this.game.eventUpdate ){
            if(this.energy < this.maxEnergy ){
                this.energy += 0.1;
            }
    
            if(this.charging){
                this.energy -=1;
            }
            if(this.energy <=0){
                this.energy = 0;
                this.stopCharge();
            }
        }

    }


    flap(){
        this.stopCharge();
        
        if(!this.isTouchingTop() ){
            this.speedY = this.flapSpeed * (-1);
            this.game.sound.play(this.game.sound.flapSounds[  Math.floor( Math.random() * 5) ] );
            this.wingsDown();
        }
    }







}




