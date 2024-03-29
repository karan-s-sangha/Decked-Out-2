class Difficulty {
    constructor(game) {
        
        this.game = game;
        this.level = 'easy'; // Default level
        this.setLevel(this.game.gameLevel); // update it
        this.artifact = new Artifact(this.game, this.game.camera.steve);
        this.compass = new Compass(this.artifact, this.game.camera.steve, this.game);
        this.artifactsCollected = 0;
       
    }

    setLevel(level) {
        this.level = level;
        if (level == null){
            this.level = 'easy';
        }
        switch(level) {
            case 'easy':
                this.artifactsToWin = 3; // Player needs to collect 5 artifacts to win
                break;
            case 'medium':
                this.artifactsToWin = 5; // Player needs to collect 10 artifacts to win
                break;
            case 'hard':
                this.artifactsToWin = 7; // Player needs to collect 15 artifacts to win
                break;
            default:
                this.artifactsToWin = 2; // Default is Medium difficulty
        }
        this.artifactsCollected = 0; // Reset collected artifacts counter
    }

    update() {
        // Check if the player has collected the required number of artifacts to win
        if (this.artifactsCollected >= this.artifactsToWin) {
            //console.log("Are the steve and play getting called?");
            this.game.camera.steve.win = true; // Set the win condition to true
            this.game.play = false; // Stop the game
        }

        if(this.artifact.item.picked){
            this.artifact = new Artifact(this.game, this.game.camera.steve);
            this.compass = new Compass(this.artifact, this.game.camera.steve, this.game);
            this.artifactsCollected++;
            // console.log(this.artifactsCollected);
        }
        else {
            this.artifact.update();
            this.compass.update();
            //this.artifact.item.AddItem();
        }
    }
    draw(ctx){
        this.artifact.draw(ctx);
        this.compass.draw(ctx);
        //console.log("Drawing in the difficulty class");

    }
}
