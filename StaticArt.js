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
             //   console.log("Image not found for block:", block.label);
                return; // Skip drawing if image not found
            }
        }
    }
}