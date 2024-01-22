class SceneManager {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;
        this.level = "./Art/Level_1_UpperView_Art/Level_1_UpperView.png";
        this.steve = new Steve(this.game,384,384);
        this.collision = new Collision();
        this.ravager = new Ravager (this.game, this.steve, this.collision, 700, 384, 5, 10,50);
        this.steve = new Steve(this.game,384,384,null);
     
       
        this.levelX=0;
        this.levelY=0;
    
        this.menuButtonCooldown = 0.15;
        
        // Checking the Compass and the Artifact
        this.artifact = new Artifact(game);
        this.compass = new Compass(this.artifact,this.steve);

        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel(this.steve, this.ravager, this.level, 0, 0);
        
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };
    
    // loadLevel is supposed to add the entities of the first level

    loadLevel(steve, ravager, level, x, y) {

       
        // Adding the first upper level
        this.game.addEntity(new StaticArt(this.game, level, x, y));

        

        // Adding the water Animation
        let water = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/water.png"];
        let waterAnimation =  new Animator(water,0,0,1308,1860,24,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, waterAnimation));

        let smokeinhallright = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallright.png"];
        let smokeinhallrightAnimation =  new Animator(smokeinhallright,0,0,1308,1860,24,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, smokeinhallrightAnimation));

        let smokeinhallleft = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallleft.png"];
        let smokeinhallleftAnimation =  new Animator(smokeinhallleft,0,0,1308,1860,24,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, smokeinhallleftAnimation));

        let lava = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/lava.png"];
        let lavaAnimation =  new Animator(lava,0,0,1308,1860,24,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, lavaAnimation));

        let fireinhall = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fireinhall.png"];
        let fireinhallAnimation =  new Animator(fireinhall,0,0,1308,1860,3,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, fireinhallAnimation));

        let firecamp = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/firecamp.png"];
        let firecampAnimation =  new Animator(firecamp,0,26,1308,1860,24,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, firecampAnimation));

        let fire = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fire.png"];
        let fireAnimation =  new Animator(fire,0,0,1308,1860,6,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, fireAnimation));

        let enchanttable = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/enchanttable.png"];
        let enchanttableAnimation =  new Animator(enchanttable,0,0,1308,1860,29,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, enchanttableAnimation));

        let candles = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/candles.png"];
        let candlesAnimation =  new Animator(candles,0,0,1308,1860,13,120/1000,0,false,true);
        this.game.addEntity(new DynamicArt(this.game, level, x, y, candlesAnimation));


    
    this.game.addEntity(steve);
    this.game.addEntity(ravager);

        //Adding the Compass Entity
        let compass = new Compass();
        //this.game.addEntity(compass);
    };

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    // This update is for the whole website including the HTML 
    update() {
    
        if(this.game.right){
            this.levelX -=8;
        }
        if(this.game.left){
            this.levelX +=8;
        }
        if(this.game.up){
            this.levelY +=8;

        }
        if(this.game.down){
            this.levelY -=8;

        }
       // this.ravager.update();

        
    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) {
        //this.ravager.draw(ctx);
    
      
        // Drawing the Level one Map
        //let levelImage = ASSET_MANAGER.cache[this.level];
        //this.ctx.drawImage(levelImage,this.levelX,this.levelY, levelImage.width*this.scale, levelImage.height*this.scale);

        //constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        //    Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });
        //drawFrame(tick, ctx, x, y, scale) {
       
        //this.waterAnimation.drawFrame(this.game.clockTick,this.ctx,this.levelX,this.levelY,this.scale)   
        //this.ctx.imageSmoothingEnabled = false;
    };
};