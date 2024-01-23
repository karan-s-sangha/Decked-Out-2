class DynamicArt {
    constructor(game, level, x, y, gifAnimation) {
        Object.assign(this, { game,level, x, y, gifAnimation });
    };

    update() {
    };

    draw(ctx) {

        this.gifAnimation.drawFrame(this.game.clockTick,ctx,this.game.camreaWorldTopLeftX,this.game.camreaWorldTopLeftY,this.game.scale)
    };
};