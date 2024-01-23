class DynamicArt {
    constructor(game, level, x, y, gifAnimation) {
        Object.assign(this, { game,level, x, y, gifAnimation });
    };

    update() {
    };

    draw(ctx) {

        this.gifAnimation.drawFrame(this.game.clockTick,ctx,this.game.cameraWorldTopLeftX,this.game.cameraWorldTopLeftY,this.game.scale)
       // this.gifAnimation.drawFrame(this.game.clockTick,ctx,this.game.camreaWorldTopLeftX,this.game.camreaTopLeftY,this.game.scale)
    };
};