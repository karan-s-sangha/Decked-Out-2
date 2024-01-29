class DynamicArt {
    constructor(game) {
        Object.assign(this, { game});
        this.dynamicArtX= 0;
        this.dynamicArtY= 0;
        this.loadAnimation();
    };
    loadAnimation(){
           // Adding the water Animation
         let animation = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Animation.png"];
         this.Animation =  new Animator(this.game, animation,0,0,1308,1860,24,120/1000,0,false,true);

    }

    update() {
    };

    draw(ctx) {
     
        this.Animation.drawMap(this.game.clockTick,ctx,0,0);
    };
};
