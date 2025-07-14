class Obstacle{

    constructor( game , x ){
        this.game = game;

        this.spriteHeight = 120;
        this.spriteWidth = 120;

        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.scaledwidth = this.spriteWidth * this.game.ratio;


        this.collisionX;
        this.collisionY;
        this.collisionRadius; 


        this.x = x;
        this.y = ( this.game.height*0.5 - this.scaledHeight ) * Math.random() ;

        this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;

        this.markedForDeletion = false ;

        this.image = document.getElementById("smallGears");

        this.frameX  = Math.floor( Math.random() * 4 );


        

    }

    update(){
        this.x -= this.game.speed;
        this.y +=this.speedY;

        this.collisionX = this.x  + this.scaledwidth *0.5;
        this.collisionY = this.y + this.scaledwidth *0.5; 

        if( !this.game.gameOver ){

            if(this.y <=0 || this.y >= this.game.height - this.scaledHeight - (150 * this.game.ratio) ){
                this.speedY  *= -1 ;
            }
        }

        else{
            this.speedY +=  0.1; 
        }



        if(this.isOffScreen() ){
            this.markedForDeletion = true;
            this.game.obstacles = this.game.obstacles.filter( Obstacle => !Obstacle.markedForDeletion );
            // console.log( "Number of obstacles : " + this.game.obstacles.length );
            if(!this.game.gameOver) this.game.score++;

            if(this.game.obstacles.length === 0){
                // this.game.gameOver = true;
                this.game.triggerGameOver();
                // this.game.player.collided = true ; 
            }
        }

        if( this.game.checkCollision( this.game.player , this) ){
            // this.game.gameOver = true;
            this.game.player.collided = true ; 
            this.game.player.stopCharge();
            this.game.player.energy = this.game.player.minEnergy ; 
            // this.game.sound.play(this.game.sound.lose);
            this.game.triggerGameOver();

        }
    }

    draw(){
        // this.game.ctx.fillRect( this.x , this.y , this.scaledwidth , this.scaledHeight );
        this.game.ctx.drawImage( this.image ,  this.frameX * this.spriteWidth , 0 , this.spriteWidth , this.spriteHeight , this.x , this.y , this.scaledwidth , this.scaledHeight );
        this.game.ctx.beginPath();

        if(this.game.isdebugModeOn){
            this.game.ctx.arc( this.collisionX , this.collisionY , this.collisionRadius , 0 , Math.PI*2 );
        }
        // this.game.ctx.arc( this.collisionX , this.collisionY , this.collisionRadius , 0 , Math.PI*2 );
        this.game.ctx.stroke();
    }

    resize(){
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.scaledwidth = this.spriteWidth * this.game.ratio;

        this.collisionRadius = this.scaledwidth * 0.45;
    }


    isOffScreen(){
        return this.x < -(this.scaledwidth) || this.y > this.game.height ;
    }
}