class TransitionScreen {
    constructor(game, sceneManager) {
        Object.assign(this, { game, sceneManager });
        
        this.elapsed = 0;
        this.message = "Loading..."; // Default message for transition screen
       // this.gameOver = false;
    };

    update() {
        this.elapsed += this.game.clockTick;
        if (this.sceneManager) {
            if (this.elapsed > 1) {
                this.game.transition = null;
                this.game.screen.loadSceneManager(this.sceneManager, false);
            } 
        } else {
            if (this.elapsed > 2) {
                this.game.transition = null;
                this.sceneManager.frontend.isInMenu = true; // Update to use the frontend from sceneManager
            } 
        }
        this.game.click = null;

    };

    draw(ctx) {
        // Draw the transition screen with the current message
        ctx.fillStyle = "#337ECD";
        ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height); 
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "40px 'Press Start 2P'";
        ctx.fillText(this.message, this.game.ctx.canvas.width / 2, this.game.ctx.canvas.height / 2); 
    };
};