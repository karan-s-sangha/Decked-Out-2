class UI {
    constructor(steve) {
        this.steve = steve;

        this.healthWidth = 163;
        this.healthHeight = 175; 
        this.healthImg = null;  // Placeholder for the image
        this.healthScale = 0.15;
        this.healthX = 40;
        this.healthY = 40;

        
        this.hungerWidth = 50;
        this.hungerHeight = 50;
        this.hungerImg = null;
        this.hungerScale = 0.5;
        this.hungerX = 480;
        this.hungerY = 40;
        this.loadAnimations();
        this.isInLoseScreen = false; // Only true when the player loses the game.
    };

    loadAnimations() {
        this.healthImg = new Image();
        this.hungerImg = new Image();
        this.healthImg = ASSET_MANAGER.cache["./Art/Player/health.png"];
        this.hungerImg = ASSET_MANAGER.cache["./Art/Player/hunger.png"];
    };



    update() {

    };

    draw(ctx) {
        let health = this.steve.health;

        if(health < 0) {
            health = 0;
        }
        for(let i = 0; i < Math.floor(health); i++) {
            ctx.drawImage(this.healthImg,0,0,this.healthWidth,this.healthHeight,this.healthX + i*this.healthWidth* this.healthScale,this.healthY,this.healthWidth * this.healthScale,this.healthHeight * this.healthScale);
        }

        if(health - Math.floor(health) >  0) {
            ctx.drawImage(this.healthImg,this.healthWidth,0,this.healthWidth,this.healthHeight,this.healthX + Math.floor(health)*this.healthWidth* this.healthScale,this.healthY,this.healthWidth * this.healthScale,this.healthHeight * this.healthScale);
        }
   
        for(let i = 0; i < 10 - Math.ceil(health); i++) {
            ctx.drawImage(this.healthImg,2*this.healthWidth,0,this.healthWidth,this.healthHeight,this.healthX + (Math.ceil(health) + i) *this.healthWidth* this.healthScale,this.healthY,this.healthWidth * this.healthScale,this.healthHeight * this.healthScale);
        }



        let hunger = this.steve.hunger;
        for(let i = 0; i < Math.floor(hunger); i++) {
            ctx.drawImage(this.hungerImg,0,0,this.hungerWidth,this.hungerHeight,this.hungerX + i*this.hungerWidth* this.hungerScale,this.hungerY,this.hungerWidth * this.hungerScale,this.hungerHeight * this.hungerScale);
        }

        if(hunger - Math.floor(hunger) >  0) {
            ctx.drawImage(this.hungerImg,this.hungerWidth,0,this.hungerWidth,this.hungerHeight,this.hungerX + Math.floor(hunger)*this.hungerWidth* this.hungerScale,this.hungerY,this.hungerWidth * this.hungerScale,this.hungerHeight * this.hungerScale);
        }
   
        for(let i = 0; i < 10 - Math.ceil(hunger); i++) {
            ctx.drawImage(this.hungerImg,2*this.hungerWidth,0,this.hungerWidth,this.hungerHeight,this.hungerX + (Math.ceil(hunger) + i) *this.hungerWidth* this.hungerScale,this.hungerY,this.hungerWidth * this.hungerScale,this.hungerHeight * this.hungerScale);
        }
        if (this.steve.live == false){
            this.drawLoseScreen(ctx);
        }
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.hungerX, this.hungerY, 1, 1);
        // ctx.save();
    };

    drawLoseScreen(ctx) {
        // ctx.fillStyle = 'rgba(170, 0, 0, 0.5)'; // Semi-transparent dark red
        //ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);


        ctx.font = "48px 'Press Start 2P'";
        ctx.fillStyle = 'white'; // Text color
        ctx.textAlign = 'center';

        // Define the lose message
        let loseMessage = "Bruh, YOU LOSE!, slain by Ravagers";

        // Calculate the position of the text to be in the center of the canvas
        let textX = ctx.canvas.width / 2;
        let textY = ctx.canvas.height / 2; // Adjust this value as needed to position the text vertically

        // Draw the lose message on the canvas
        ctx.fillText(loseMessage, textX, textY);

        // Optional: Draw a button or instruction to return to the title screen or retry
        // this.drawReturnToTitleButton(ctx);
    }


}