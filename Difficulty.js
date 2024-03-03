class Difficulty {
    constructor(game, level = 'Normal') {
        this.game = game;
        this.setLevel(level);
        this.artifact = new Artifact(this.game, this.game.camera.steve);
        this.compass = new Compass(this.artifact, this.game.camera.steve, this.game);
       
    }

    setLevel(level) {
        this.level = level;
        switch(level) {
            case 'Easy':
                this.artifactsToWin = 1; // Player needs to collect 5 artifacts to win
                break;
            case 'Normal':
                this.artifactsToWin = 2; // Player needs to collect 10 artifacts to win
                break;
            case 'Hard':
                this.artifactsToWin = 3; // Player needs to collect 15 artifacts to win
                break;
            default:
                this.artifactsToWin = 2; // Default is Normal difficulty
        }
        this.artifactsCollected = 0; // Reset collected artifacts counter
    }

    update() {
        //console.log("updating in the difficulty class", this.level);

        // Check if the player has collected the required number of artifacts to win
        if (this.artifactsCollected >= this.artifactsToWin) {
            //console.log("Are the steve and play getting called?");
            this.game.camera.steve.win = true; // Set the win condition to true
            this.game.play = false; // Stop the game
        }

        if(this.artifact.item.picked){
            this.artifact = new Artifact(this.game, this.game.camera.steve);
            this.compass = new Compass(this.artifact, this.game.camera.steve, this.game);
            // this.artifactsCollected++;
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
