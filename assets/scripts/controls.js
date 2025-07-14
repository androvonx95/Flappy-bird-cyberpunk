class Controls{

    constructor( Game ){
        this.Game = Game;

        this.restartBtn = document.getElementById("restartButton");
        this.debugBtn = document.getElementById("debugButton");
        this.fullScreenButton = document.getElementById("fullScreenButton");
        this.pauseButton = document.getElementById("PauseButton");
        this.isFullScreenModeActive = false;


        // Apply the scaling to the controls container and buttons based on the ratio
        this.resize();

        this.restartBtn.addEventListener("click" , ()=>{
            this.Game.score = 0;
            this.Game.timer = 0;
            this.Game.gameOver = false;
            this.Game.isPaused = false;
            this.Game.resize( window.innerWidth , window.innerHeight );
            console.log("Restart button has been clicked");
            this.pauseButton.innerHTML = "&#x23F8;";
            this.pauseButton.title = "Pause";
        });


        this.debugBtn.addEventListener( "click" , ()=>{
            this.Game.isdebugModeOn = !this.Game.isdebugModeOn;
        });

        this.fullScreenButton.addEventListener( "click" , ()=>{
            this.goFullScreen();
        });

        this.pauseButton.addEventListener( "click" , ()=>{
            this.Game.isPaused = !this.Game.isPaused;
            console.log(this.Game.isPaused);
            console.log("debugging")
            this.Game.ctx.textAlign = 'center';
            this.Game.ctx.font = this.Game.largeFont + 'px Bungee';
            this.Game.ctx.fillText( "Game is Paused" , this.Game.width * 0.5 , this.Game.height * 0.5 - this.Game.largeFont  , this.Game.width);
            this.Game.ctx.fillText("Press shift for booster", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont);
            this.Game.ctx.fillText("Press space/enter to flap", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont * 2);
            this.Game.ctx.fillText("Press R to restart", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont * 3);
            this.Game.ctx.fillText("Press D to toggle debug mode", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont * 4);
            this.Game.ctx.fillText("Press F to toggle fullscreen", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont * 5);
            this.Game.ctx.fillText("Press P to pause", this.Game.width * 0.5, this.Game.height * 0.5 + this.Game.largeFont * 6);
            
            if(this.Game.isPaused){
                this.pauseButton.innerHTML = "&#9654;";
                this.pauseButton.title = "Resume";
            }

            else{
                this.pauseButton.innerHTML = "&#x23F8;";
                this.pauseButton.title = "Pause";
            }
            this.Game.ctx.font = this.Game.smallFont + 'px Bungee';
            this.Game.ctx.restore();
            
        });



    }


    debugMode(){
        console.log(this.Game.obstacles.length);
        this.Game.obstacles.forEach(obstacle => {
            // this.Game.ctx.arc( obstacle.collisionX , obstacle.collisionY , obstacle.collisionRadius , 0 , Math.PI*2 );
            obstacle.debugMode();
        });

        this.Game.ctx.beginPath();
        this.Game.ctx.arc( this.Game.player.collisionX + this.Game.player.collisionRadius * 0.9 , this.Game.player.collisionY , this.Game.player.collisionRadius , 0 , Math.PI*2 );
        this.Game.ctx.stroke();  // This will draw the circle outline
        console.log("Debug button has been clicked");
    }

    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    goFullScreen() {
        

        if(!this.isFullScreenModeActive){
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            } 
        }

        else{
            this.exitFullScreen();
        }

        this.isFullScreenModeActive = !this.isFullScreenModeActive;

    }

    // Helper function to scale a button
    scaleButton(button, ratio) {
        button.style.padding = `${10 * ratio}px`;
        button.style.fontSize = `${16 * ratio}px`;
    }

    resize() {
        const ratio = this.Game.ratio + 0.1;
    
        // Log ratio to see if it's correct
        // console.log("Scaling ratio:", ratio);
    
        // Scale the controls container
        const controls = document.querySelector(".controls");
        controls.style.padding = `${10 * ratio}px`;
        controls.style.gap = `${20 * ratio}px`;
    
        // Log values to check scaling
        // console.log("Controls padding:", controls.style.padding);
        // console.log("Controls gap:", controls.style.gap);
    
        // Scale individual buttons
        this.scaleButton(this.restartBtn, ratio);
        this.scaleButton(this.debugBtn, ratio);
        this.scaleButton(this.fullScreenButton, ratio);
        this.scaleButton(this.pauseButton , ratio);
    }
    



}