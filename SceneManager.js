class SceneManager {
    constructor(game, steve) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.screen = this;

        this.steve = steve;

        this.menuButtonCooldown = 0.15;

        
        // Checking the Compass and the Artifact
        this.artifact = new Artifact(this.game, this.steve);
        this.ember = new FrostEmbers(this.game, this.steve);
        this.treasure = new Treasure(this.game, this.steve);
        //this.cards = new Cards(this.steve, this.treasure, this.ember);

        this.compass = new Compass(this.artifact,this.steve, this.game);
      

        this.ui = new UI(this.steve);
        
        
        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel();
        
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };
    
    // loadLevel is supposed to add the entities of the first level

    loadLevel() {

        
        // Adding the first upper level static art
        this.game.addEntity(new StaticArt(this.game));

        // // Adding the first upper level dynamic art
       //this.game.addEntity(new DynamicArt(this.game));
            
        this.game.addEntity(this.steve);

       //this.addRavagers();

        //Adding the Compass Entity
       //this.game.addEntity(this.compass);

        //Adding All the Item Entity
        this.game.addEntity(this.artifact);
        this.game.addEntity(this.treasure);
        this.game.addEntity(this.ember);

        //Adding the card entity
        //this.game.addEntity(this.cards);

        this.game.addEntity(this.ui);
        
    };

    addRavagers() {
        this.ravagerPositions = [
            { x: 756, y: 444 },
            { x: 1332, y: 2348 },
            { x: 556, y: 4572 },
            { x: 1468, y: 6348 },
            { x: 4078, y: 4852 },
            { x: 1740, y: 4252 },
            { x: 2460, y: 2532 },
            { x: 4116, y: 2124 },
            { x: 4324, y: 4884 },
            { x: 3972, y: 1204 },
            { x: 444, y: 2340 },
            { x: 3492, y: 2796 },
            { x: 2276, y: 6060 }
        ];
    
        this.ravagerPositions.forEach(pos => {
            let ravager = new Ravager(this.game, this.steve, this.collision, pos.x, pos.y, 0.3, 1, 50);
            this.game.addEntity(ravager);
            this.ravagers.push(ravager);
        });
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
    draw(ctx) { // <- what's calling this?
        if (this.frontend.isInMenu || this.frontend.isShowInstructions || this.frontend.isInCredits) {
            this.frontend.draw(ctx);
        } else if (this.frontend.isInLoseScreen){
           this.frontend.drawLoseScreen(ctx);
           } else if (this.frontend.isInWinScreen){
            this.frontend.drawWinScreen(ctx);
           }
       
    };

};