class StaticArt {
    constructor(game, level, x, y) {
        Object.assign(this, { game,level, x, y });

    };

    update() {
    };

    draw(ctx) {

        let levelImage = ASSET_MANAGER.cache[this.level];
        ctx.drawImage(levelImage,this.game.x,this.game.y, 
            levelImage.width*this.game.scale, levelImage.height*this.game.scale); 
    };
};