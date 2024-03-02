class StaticArt {
    constructor(game) {
        this.game = game;
        this.radiusXY = 12; // Radius for drawing and calculations in the XY plane
        this.radiusZ = 3;  // Radius for drawing and calculations in the Z dimension
        this.blocks = [];
        this.reachableBlocks = []; // Updated to store blocks that are reachable in a relative manner
    }

    update() {
        // Placeholder for future update logic
    }

    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.ceil(this.game.camera.steve.playerZ);
        
        this.blocks = [];
        this.reachableBlocks = [];
        this.expandAroundSteve(playerX, playerY, playerZ);

        let blocks = this.sortBlocksForDrawing(this.blocks);
        blocks.forEach(block => this.drawBlock(ctx, block));
    }

    expandAroundSteve(playerX, playerY, playerZ) {
        const visited = new Set(); // Tracks all visited blocks for expansion
        this.blocks = []; // Reset the blocks list to ensure it's empty at the start of each expansion
        this.reachableBlocks = []; // Similarly, reset the reachable blocks list
    
        const queue = [{ x: playerX, y: playerY, z: playerZ, isReachable: true }]; // Starting point is always reachable
    
        while (queue.length > 0) {
            const { x, y, z, isReachable } = queue.shift();
            const key = `${x},${y},${z}`;
    
            if (visited.has(key) || !this.game.camera.blocksMap[key]) {
                continue; // Skip already visited locations
            }
    
            // Mark as visited
            visited.add(key);
            let isInRadius = Math.abs(x - playerX) <= this.radiusXY && Math.abs(y - playerY) <= this.radiusXY && Math.abs(z - playerZ) <= this.radiusZ;
    
            // Check if this block is within the defined radius from the player
            if (isInRadius) {
                const block = this.game.camera.blocksMap[key];
                if (block) {
                    // If the block exists in the map, add it to the blocks list
                    //this.blocks.push(block);
    
                    if (isReachable) {
                        // If the block is marked as reachable and hasn't been added to the reachableBlocks list yet
                        if (!this.reachableBlocks.find(b => b.x === x && b.y === y && b.z === z)) {
                            block.reachable = true; // Mark the block as reachable
                            this.reachableBlocks.push(block); // Add this block to the list of reachable blocks
                        }
                    }
    
                    // Queue neighboring positions for further exploration
                    this.getNeighborPositions(x, y, z).forEach(({ dx, dy, dz }) => {
                        // Only consider this neighbor if moving to it is possible
                        let xe = x+dx;
                        let ye = y+dy;
                        let ze = z+dz;
                        let k = `${xe},${ye},${ze}`;
                        if (this.isMovable(x, y, z, dx, dy, dz) ) {
                            queue.push({ x: x + dx, y: y + dy, z: z + dz, isReachable: isReachable && this.isMovable(x, y, z, dx, dy, dz) });
                        }
                        else if (this.game.camera.blocksMap[k]){
                            this.blocks.push(block);
                        }
                    });
                }
            }
        }
    }
    
    
    
    sortBlocksForDrawing(blocks) {
        // Sort by Z first to ensure vertical positioning is respected
        // Then sort by the sum of X and Y for proper isometric depth sorting
        return blocks.sort((a, b) => {
            if (a.z !== b.z) {
                return a.z - b.z;
            }
            return (a.x + a.y) - (b.x + b.y);
        });
    }

    isMovable(currX, currY, currZ, dx, dy, dz) {
        // Example logic for a simple movement rule: movement is possible if there's no obstacle
        const targetKey = `${currX + dx},${currY + dy},${currZ + dz}`;
        const targetBlock = this.game.camera.blocksMap[targetKey];
        const oneAboveTargetKey = `${currX + dx},${currY + dy},${currZ + dz + 1}`;
        const twoAboveTargetKey = `${currX + dx},${currY + dy},${currZ + dz + 2}`;
        const oneAboveTargetBlock = this.game.camera.blocksMap[oneAboveTargetKey];
        const twoAboveTargetBlock = this.game.camera.blocksMap[twoAboveTargetKey];

        return targetBlock && !oneAboveTargetBlock && !twoAboveTargetBlock; // Ensure the target block exists and there's no block directly above it
    }

    drawBlock(ctx, block) {
        const { isoX, isoY, blockImage, sizeFactor } = this.calculateBlockDrawingParams(block);
        if (!blockImage) return; // Skip drawing if there's no image for the block
    
        // Check if the block is in the list of reachable blocks
        const isReachable = this.reachableBlocks.some(b => b.x === block.x && b.y === block.y && b.z === block.z).reachable;
    
        ctx.save(); // Save the current context state
        //ctx.globalAlpha = isReachable ? 0 : 0.5; // Set transparency based on reachability
    
        // Draw the block
        ctx.drawImage(blockImage, isoX, isoY, blockImage.width * sizeFactor, blockImage.height * sizeFactor);

        ctx.globalAlpha = 0;

        ctx.restore(); // Restore the context state, resetting globalAlpha among other properties
    }
    
    calculateBlockDrawingParams(block) {
        const { steve, isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor } = this.game.camera;
        const blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];

        // const isoX = ((block.x - block.y) * imageWidth * sizeFactor / 2) - isoCameraX - imageWidth/2;
        // const isoY = ((block.x + block.y) * imageHeight * sizeFactor / 4) - (block.z - steve.playerZ) * imageHeight * sizeFactor / 2 - isoCameraY + imageHeight/2;;

        let isoX = ((block.x - block.y) * imageWidth * sizeFactor / 2) - isoCameraX - (imageWidth * sizeFactor) / 2;
        let isoY = ((block.x + block.y) * imageHeight * sizeFactor / 4) - (block.z -  steve.playerZ) * imageHeight * sizeFactor / 2 - isoCameraY + (imageHeight * sizeFactor) / 2;
  
        return { isoX, isoY, blockImage, sizeFactor };
    }

    getNeighborPositions(x, y, z) {
        const neighbors = [];
        for (let dz = -1; dz <= 1; dz++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx !== 0 || dy !== 0 || dz !== 0) {
                        neighbors.push({ dx, dy, dz });
                    }
                }
            }
        }
        return neighbors;
    }
}