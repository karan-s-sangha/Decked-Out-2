class StaticArt {
    constructor(game) {
        Object.assign(this, { game});
        this.staticArtX= 0;
        this.staticArtY= 0;
    };

    update() {
    };

    draw(ctx) {

        let levelImage = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView.png"];
            ctx.drawImage(levelImage, 

            (this.game.camera.cameraX)/this.game.GameScale, (this.game.camera.cameraY)/this.game.GameScale, 
            this.game.ctx.canvas.width/this.game.GameScale, this.game.ctx.canvas.height/this.game.GameScale, 

            0, 0, 
            this.game.ctx.canvas.width, this.game.ctx.canvas.height, 
            );
    };
};
