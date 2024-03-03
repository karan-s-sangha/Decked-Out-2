class BlocksUnderPlayer {
    constructor(staticArt) {
        this.staticArt = staticArt;
    }

    update() {
        // Placeholder for future update logic
    }

    draw(ctx) {
        const playerX = Math.floor(this.staticArt.game.camera.steve.playerX);
        const playerY = Math.floor(this.staticArt.game.camera.steve.playerY);
        const playerZ = Math.ceil(this.staticArt.game.camera.steve.playerZ);

        // Filter blocks that are visually behind or at the same level as Steve in isometric view
        //this.game.camera.blocksMap[key]
        // if(this.game.camera.blocksMap[key]         ){

        // }


        let blocks = this.staticArt.blocks.filter(block => 
            block.x <= playerX ||  block.y <= playerY  
        );

        // Sort blocks for isometric drawing; blocks with lower y values are drawn first, then x, then z
        blocks = this.staticArt.sortBlocksForDrawing(blocks);

        blocks.forEach(block => this.staticArt.drawBlock(ctx, block));
    }
}