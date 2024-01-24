class DynamicArt {
    constructor(game) {
        Object.assign(this, { game});
        this.dynamicArtX= 0;
        this.dynamicArtY= 0;
        this.loadAnimation();
    };
    loadAnimation(){
           // Adding the water Animation
         let water = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/water.png"];
         this.waterAnimation =  new Animator(this.game, water,0,0,1308,1860,24,120/1000,0,false,true);

         let smokeinhallright = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallright.png"];
         this.smokeinhallrightAnimation =  new Animator(this.game,smokeinhallright,0,0,1308,1860,24,120/1000,0,false,true);

         let smokeinhallleft = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallleft.png"];
         this.smokeinhallleftAnimation =  new Animator(this.game,smokeinhallleft,0,0,1308,1860,24,120/1000,0,false,true);
   
         let lava = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/lava.png"];
         this.lavaAnimation =  new Animator(this.game,lava,0,0,1308,1860,24,120/1000,0,false,true);

         let fireinhall = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fireinhall.png"];
         this.fireinhallAnimation =  new Animator(this.game,fireinhall,0,0,1308,1860,3,120/1000,0,false,true);

         let firecamp = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/firecamp.png"];
         this.firecampAnimation =  new Animator(this.game,firecamp,0,26,1308,1860,24,120/1000,0,false,true);

         let fire = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fire.png"];
         this.fireAnimation =  new Animator(this.game,fire,0,0,1308,1860,6,120/1000,0,false,true);

         let enchanttable = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/enchanttable.png"];
         this.enchanttableAnimation =  new Animator(this.game,enchanttable,0,0,1308,1860,29,120/1000,0,false,true);

         let candles = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/candles.png"];
         this.candlesAnimation =  new Animator(this.game,candles,0,0,1308,1860,13,120/1000,0,false,true);
    }

    update() {
    };

    draw(ctx) {
        //
        this.waterAnimation.drawMap(this.game.clockTick,ctx,0,0);
        
        //-----
        this.smokeinhallrightAnimation.drawMap(this.game.clockTick,ctx,0,0);

        //-----
        this.smokeinhallleftAnimation.drawMap(this.game.clockTick,ctx,0,0);

        //
        this.lavaAnimation.drawMap(this.game.clockTick,ctx,0,0);

        this.fireinhallAnimation.drawMap(this.game.clockTick,ctx,0,0);

        //------------
        this.firecampAnimation.drawMap(this.game.clockTick,ctx,0,-26);

        //------------
        this.fireAnimation.drawMap(this.game.clockTick,ctx,0,0);

        //------------
        this.enchanttableAnimation.drawMap(this.game.clockTick,ctx,0,0);

        //------------
        this.candlesAnimation.drawMap(this.game.clockTick,ctx,0,0);
    };
};

//    // Adding the water Animation
//    let water = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/water.png"];
//    let waterAnimation =  new Animator(water,0,0,1308,1860,24,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, waterAnimation));

//    let smokeinhallright = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallright.png"];
//    let smokeinhallrightAnimation =  new Animator(smokeinhallright,0,0,1308,1860,24,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, smokeinhallrightAnimation));

//    let smokeinhallleft = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/smokeinhallleft.png"];
//    let smokeinhallleftAnimation =  new Animator(smokeinhallleft,0,0,1308,1860,24,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, smokeinhallleftAnimation));

//    let lava = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/lava.png"];
//    let lavaAnimation =  new Animator(lava,0,0,1308,1860,24,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, lavaAnimation));

//    let fireinhall = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fireinhall.png"];
//    let fireinhallAnimation =  new Animator(fireinhall,0,0,1308,1860,3,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, fireinhallAnimation));

//    let firecamp = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/firecamp.png"];
//    let firecampAnimation =  new Animator(firecamp,0,26,1308,1860,24,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, firecampAnimation));

//    let fire = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/fire.png"];
//    let fireAnimation =  new Animator(fire,0,0,1308,1860,6,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, fireAnimation));

//    let enchanttable = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/enchanttable.png"];
//    let enchanttableAnimation =  new Animator(enchanttable,0,0,1308,1860,29,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, enchanttableAnimation));

//    let candles = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/candles.png"];
//    let candlesAnimation =  new Animator(candles,0,0,1308,1860,13,120/1000,0,false,true);
//    this.game.addEntity(new DynamicArt(this.game, level, x, y, candlesAnimation));