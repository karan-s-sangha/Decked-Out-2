class StaticArt {
    constructor(game) {
        this.game = game;
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

    draw(ctx) {
        // Player's current position
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.floor(this.game.camera.steve.playerZ); // Assuming you have a Z-coordinate
    
        // Block dimensions
        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;
    
        // Determine the range of blocks to check
        const radius = 15; // The radius around the player
        for (let z = playerZ - radius; z <= playerZ + radius; z++) {
            for (let y = playerY - radius; y <= playerY + radius; y++) {
                for (let x = playerX - radius; x <= playerX + radius; x++) {
                    // Construct the key for the current block position
                    const blockKey = `${x},${y},${z}`;
                    const block = this.game.camera.blocksMap[blockKey];
                    if (!block) continue; // Skip if no block found at this position
    
                    let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];
                    if (!blockImage) {
                        console.log("Image not found for block:", block.label);
                        continue; // Skip drawing if image not found
                    }
    
                    // Calculate the isometric position for the block
                    let isoX = (x - y) * blockWidth / 2;
                    let isoY = (x + y) * blockHeight / 4 - (z * blockHeight / 2);
    
                    // Adjust the drawing position based on the camera's position to ensure the map moves with the camera
                    isoX -= (blockWidth / 2 + this.game.camera.isoCameraX);
                    isoY -= this.game.camera.isoCameraY;
    
                    // Draw the block image at the calculated isometric position
                    ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
                }
            }
        }
    }    
}
