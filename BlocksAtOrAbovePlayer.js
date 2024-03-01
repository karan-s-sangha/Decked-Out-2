class BlocksAtOrAbovePlayer {
    constructor(staticArt) {
        this.staticArt = staticArt;
    }

    update() {
        // Placeholder for future update logic
    }

    draw(ctx) {
        // Access the playerZ through the staticArt reference to its game object
        const playerZ = Math.ceil(this.staticArt.game.camera.steve.playerZ);
        // Filter the blocks that are at or above the playerZ level
        let blocks = this.staticArt.blocks.filter(block => block.z > playerZ);

        // Sort the blocks for drawing using the staticArt's sorting method
        blocks = this.staticArt.sortBlocksForDrawing(blocks);
        // Draw each block using the staticArt's drawBlock method
        blocks.forEach(block => this.staticArt.drawBlock(ctx, block));
        //console.log("Above block");
    }
}
