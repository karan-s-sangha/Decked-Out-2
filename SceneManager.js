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
       // this.titlescreen = new Titlescreen(game, this);
        this.loadSceneManager(this.level, false);
    };

    loadSceneManager(level, isTransition) {
        if (isTransition) {
            this.game.transition = new TransitionScreen(this.game, level);
        } else if (this.frontend.isInMenu == false && this.frontend.isInCredits == false 
            && this.frontend.isShowInstructions == false) {
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
        if (this.frontend.isInMenu || this.frontend.isInCredits || this.frontend.isShowInstructions){
            this.frontend.update();
        } else if (this.steve.live === false) {
            this.frontend.isInLoseScreen = !this.steve.live;
            //this.frontend.update();
        } else if(this.steve.win === true) {
            this.frontend.isInWinScreen = this.steve.win;
            //this.frontend.update();
        }

    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) { 
        if (this.frontend.isInMenu || this.frontend.isShowInstructions || this.frontend.isInCredits) {
            this.frontend.draw(ctx);
        } else if (this.frontend.isInLoseScreen){
           this.frontend.drawLoseScreen(ctx);
           } else if (this.frontend.isInWinScreen){
            this.frontend.drawWinScreen(ctx);
           }
       
    };

};