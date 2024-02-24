class StaticArt {
    constructor(game) {
        this.game = game;
        
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

   
    draw(ctx) {
        // Ensure reachable blocks are computed
            const playerX = Math.floor(this.game.camera.steve.playerX);
            const playerY = Math.floor(this.game.camera.steve.playerY);
            const playerZ = Math.floor(this.game.camera.steve.playerZ);
            let movable = this.getReachableBlocks(playerX, playerY, playerZ);
        

        for (let blockKey of movable) {
            let [x, y, z] = blockKey.split(',').map(Number);
            // Draw logic for blocks directly in reachableBlocksSet
            this.drawBlock(ctx, x, y, z);

            // Additionally, draw the block directly underneath each reachable block
            this.drawBlock(ctx, x, y, z - 1);
        }
    }

    drawBlock(ctx, x, y, z) {
        const blockKey = `${x},${y},${z}`;
        const block = this.game.camera.blocksMap[blockKey];
        if (!block) return; // Skip if no block found at this position

        let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];
        if (!blockImage) return; // Skip drawing if image not found

        // Calculate and adjust the isometric position for the block
        // Similar calculations as before, adjusted for the specific block coordinates
        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;
        let relativeX = x ;
        let relativeY = y ;
        let relativeZ = z - Math.floor(this.game.camera.steve.playerZ);
        let isoX = (relativeX - relativeY) * blockWidth / 2 - (blockWidth / 2 + this.game.camera.isoCameraX);
        let isoY = (relativeX + relativeY) * blockHeight / 4 - (relativeZ * blockHeight / 2) - this.game.camera.isoCameraY;

        // Draw the block image at the calculated isometric position
        ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
    }


    getReachableBlocks(playerX, playerY, playerZ) {
        const radius = 10; // Define the search radius
        let startBlockX = Math.floor(playerX);
        let startBlockY = Math.floor(playerY);
        let startBlockZ = Math.floor(playerZ - 1); // Consider the player's standing position

        let openSet = new Set([`${startBlockX},${startBlockY},${startBlockZ}`]);
        let closedSet = new Set();
        
        while (openSet.size > 0) {
            let current = openSet.values().next().value; // Get an item from the set
            let [currX, currY, currZ] = current.split(',').map(Number);
            openSet.delete(current);
            closedSet.add(current);

            for (let dz of [-1, 0, 1]) {
                for (let dy of [-1, 0, 1]) {
                    for (let dx of [-1, 0, 1]) {
                        if (dx === 0 && dy === 0 && dz === 0) continue;

                        let neighborX = currX + dx;
                        let neighborY = currY + dy;
                        let neighborZ = currZ + dz;

                        // Check if the neighbor is within the radius
                        if (Math.abs(neighborX - startBlockX) > radius ||
                            Math.abs(neighborY - startBlockY) > radius ||
                            Math.abs(neighborZ - startBlockZ) > radius) continue;

                        let neighbor = `${neighborX},${neighborY},${neighborZ}`;
                        if (closedSet.has(neighbor) || !this.isMovable(currX, currY, currZ, dx, dy, dz)) continue;

                        openSet.add(neighbor);
                    }
                }
            }
        }

        return closedSet;
    }
    
    isMovable(currX, currY, currZ, dx, dy, dz) {
        // Check for the existence of the block in the target location
        let targetBlockExists = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz}`] !== undefined;
        // Check if there are two blocks of free space above the target location for Steve to stand
        let spaceAboveTarget = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 1}`] === undefined &&
                               this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 2}`] === undefined;

    
        // // For falling down (dz = -1), ensure the destination block below is clear
        // if (dz === -1) {
        //     // Only need to check the block directly below is not existing (Steve can fall into it)
        //     return !this.game.camera.blocksMap[`${currX},${currY},${currZ - 1}`];
        // }
    
        return targetBlockExists && spaceAboveTarget;
    }
    
}