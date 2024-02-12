class SceneManager {
    constructor(game, steve) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.screen = this;

        this.steve = steve;

        this.menuButtonCooldown = 0.15;


        this.level = null;
        this.gameOver = false;
        this.frontend = new FrontEnd(game, this);
        this.loadSceneManager(this.level, false);
    };

    loadSceneManager(level, isTransition) {
        if (isTransition) {
            this.game.transition = new TransitionScreen(this.game, level);
        } else if (this.frontend.isInMenu == false) {
            this.steve.live = false;
            this.game.play = true;
        }
    }

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    // This update is for the whole website including the HTML 
    update() {
       //this.frontend.isInLoseScreen = !this.steve.live;
      // this.frontend.isInWinScreen = this.steve.win;
        if (this.frontend.isInMenu || this.frontend.isInCredits || this.frontend.isShowInstructions){
            this.frontend.update();
        }
        // Let the frontend handle the music based on its state
       // this.frontend.update();

    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) { // <- what's calling this?
        if (this.frontend.isInMenu || this.frontend.isShowInstructions || this.frontend.isInCredits) {
            this.frontend.draw(ctx);
        } else if (this.frontend.isInLoseScreen){
           this.frontend.drawLoseScreen(ctx);
           this.frontend.drawWinScreen(ctx);
           } else if (this.frontend.isInWinScreen){
            this.frontend.drawWinScreen(ctx);
           }
    };

};