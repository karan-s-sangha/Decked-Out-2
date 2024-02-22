class StaticArt {
    constructor(game) {
        this.game = game;
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

    draw(ctx) {
        // Ensure block dimensions are defined. If using a default size, initialize them accordingly.
        let blockWidth, blockHeight;

        // Loop through each block defined in the camera's block array
        this.game.camera.blocks.forEach(block => {
            let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`]; // Assuming block.label contains the image file name
            if (!blockImage) {
                console.log("Image not found for block:", block.label);
                return; // Skip drawing if image not found
            }

            // Apply size factor to determine the final width and height of the block
            blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
            blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

            // Calculate the isometric position for the block
            // The isometric projection formulas convert cartesian coordinates (x, y) to isometric coordinates.
            let isoX = (block.x - block.y) * blockWidth / 2;
            let isoY = (block.x + block.y) * blockHeight / 4; // Assuming a 2:1 ratio for isometric projection

            // Adjust for the block's z-coordinate (height) if necessary
            isoY -= block.z * blockHeight / 2; // Adjust isoY based on the z value to simulate elevation

            // Adjust the drawing position based on the camera's position to ensure the map moves with the camera
            isoX -= this.game.camera.isoCameraX;
            isoY -= this.game.camera.isoCameraY;

            // Adjust the drawing position to ensure the player is centered at 0,0
            isoX -= blockWidth/2 ;

            // Draw the block image at the calculated isometric position
            ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
        });
    }
}
