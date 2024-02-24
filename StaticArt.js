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
        const playerZ = Math.floor(this.game.camera.steve.playerZ);
    
        // Block dimensions
        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;
    
        // Determine the range of blocks to check
        const radius = 18; // The radius around the player
        for (let z = playerZ - 5; z <= playerZ + 5; z++) {
            for (let y = playerY - radius; y <= playerY + radius; y++) {
                for (let x = playerX - radius; x <= playerX + radius; x++) {
                    // Construct the key for the current block position
                    const blockKey = `${x},${y},${z}`;
                    const block = this.game.camera.blocksMap[blockKey];
                    if (!block) continue; // Skip if no block found at this position
    
                    let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];
                    if (!blockImage) {
                        //console.log("Image not found for block:", block.label);
                        continue; // Skip drawing if image not found
                    }
    
                    // Calculate the isometric position for the block, adjusting for player position
                    let relativeX = x ;
                    let relativeY = y ;
                    let relativeZ = z - playerZ;
    
                    let isoX = (relativeX - relativeY) * blockWidth / 2;
                    let isoY = (relativeX + relativeY) * blockHeight / 4 - (relativeZ * blockHeight / 2);
    
                    // // Center the drawing on the canvas based on the player's position
                    // isoX += ctx.canvas.width / 2 - blockWidth / 2;
                    // isoY += ctx.canvas.height / 2 - blockHeight / 4; // Adjust based on the typical block height to center
    
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
