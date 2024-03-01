class BlocksUnderPlayer extends StaticArt {
    constructor(game) {
    }
    update(){
        
    }
    draw(ctx) {
        const playerZ = Math.ceil(this.game.camera.steve.playerZ);
        let blocks = this.blocks.filter(block => block.z < playerZ);

        blocks = this.sortBlocksForDrawing(blocks);
        blocks.forEach(block => this.drawBlock(ctx, block));
    }
}
