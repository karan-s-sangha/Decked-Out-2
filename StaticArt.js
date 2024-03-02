class StaticArt {
    constructor(game) {
        this.game = game;
        this.radiusXY = 15; // Radius for drawing and calculations in the XY plane
        this.radiusZ = 3;  // Radius for drawing and calculations in the Z dimension
        this.blocks;
    }
    
    update() {
        // Placeholder for future update logic
    }

    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.ceil(this.game.camera.steve.playerZ);
        
        this.blocks = this.expandAroundSteve(playerX, playerY, playerZ);

        // // Sort the blocks for proper drawing order
        // let blocks = this.sortBlocksForDrawing(this.blocks);

        // blocks.forEach(block => this.drawBlock(ctx, block));
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
    
    drawBlock(ctx, block) {
        const { isoX, isoY, blockImage, sizeFactor } = this.calculateBlockDrawingParams(block);
    
        if (!blockImage) return;
    
        ctx.save();
        ctx.globalAlpha = 1 - block.transparency;
        //console.log(ctx.globalAlpha);
        //console.log(isoX,isoY);
        //console.log("Hello");
        //console.log(isoX,isoY,blockImage,sizeFactor);
        ctx.drawImage(blockImage, isoX, isoY, blockImage.width * sizeFactor, blockImage.height * sizeFactor);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    calculateBlockDrawingParams(block) {
        let playerZ = this.game.camera.steve.playerZ;
        let isoCameraX = this.game.camera.isoCameraX;
        let isoCameraY = this.game.camera.isoCameraY;
        let imageWidth = this.game.camera.imageWidth;
        let imageHeight = this.game.camera.imageHeight;
        let sizeFactor = this.game.camera.sizeFactor;

        const blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];
        let isoX = ((block.x - block.y) * imageWidth * sizeFactor / 2) - isoCameraX - (imageWidth * sizeFactor) / 2;
        let isoY = ((block.x + block.y) * imageHeight * sizeFactor / 4) - (block.z - playerZ) * imageHeight * sizeFactor / 2 - isoCameraY + (imageHeight * sizeFactor) / 2;
    
        return { isoX, isoY, blockImage, sizeFactor, imageWidth, imageHeight };
    }

        while (queue.length > 0) {
            const { x, y, z } = queue.shift();
            const key = `${x},${y},${z}`;

                            blocksInRange.push({ ...block, x, y, z, transparency });
                        }
                        else {
                            blocksInRange.push({ ...block, x, y, z, transparency: 0 });
                        }
                    });
                }
            }
        }

        return blocksInRange;
    }

    drawBlock(ctx, block) {
        const { isoX, isoY, blockImage, sizeFactor } = this.calculateBlockDrawingParams(block);
        if (!blockImage) return;
 
        ctx.save();
        //ctx.globalAlpha = 1 - (block.transparency || 0); // Default transparency to 0 if not defined
        ctx.drawImage(blockImage, isoX, isoY, blockImage.width * sizeFactor, blockImage.height * sizeFactor);
        ctx.restore();
    }

    calculateBlockDrawingParams(block) {
        const { steve, isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor } = this.game.camera;
        const blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];

        const isoX = ((block.x - block.y) * imageWidth * sizeFactor / 2) - isoCameraX;
        const isoY = ((block.x + block.y) * imageHeight * sizeFactor / 4) - (block.z - steve.playerZ) * imageHeight * sizeFactor / 2 - isoCameraY;

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
    
        return blocksInRange;
    }
    
    
    groupAndSortReachableBlocks(playerX, playerY, playerZ) {
        const reachableBlocks = this.getReachableBlocks(playerX, playerY, playerZ);
    
        // Object to hold the groups of blocks based on the new isometric view definition
        const isometricGroups = {};
    
        reachableBlocks.forEach(block => {
            // The isoKey calculation remains the same, identifying isometric views
            const isoKey = `${block.x - block.y}, ${block.y - block.z}`;
    
            // Check if there isn't already a block in the same isometric view,
            // or if the current block is closer in distance,
            // or if it has a lower z value than the one currently stored.
            if (!isometricGroups[isoKey] || 
                isometricGroups[isoKey].distance > block.distance 
                //|| Math.abs(isometricGroups[isoKey].z - this.game.camera.steve.playerZ) < (block.z - this.game.camera.steve.playerZ)
                ) {
                isometricGroups[isoKey] = block;
            }
        });
    
        // Convert the isometric groups object back into an array of blocks
        return Object.values(isometricGroups);
    }
    
    


    getReachableBlocks(playerX, playerY, playerZ) {
        let openSet = [{ x: playerX, y: playerY, z: playerZ, distance: 0 }];
        let closedSet = new Set();
        let distances = {};
        //closedSet.add(`${playerX},${playerY},${current.z}`);
        //distances[currentKey] = current.distance;
    
        while (openSet.length) {
            openSet.sort((a, b) => a.distance - b.distance);
            let current = openSet.shift();
            let currentKey = `${current.x},${current.y},${current.z}`;
    
            if (!closedSet.has(currentKey)) {
                closedSet.add(currentKey);
                distances[currentKey] = current.distance;
    
                // Check if the current block is within the specified radius before adding neighbors
                if (current.distance <= this.radius) {
                    this.addNeighborsToOpenSet(current, openSet, closedSet, distances);
                }
            }
        }
    
        return Array.from(closedSet).map(key => {
            let [x, y, z] = key.split(',').map(Number);
            return { x, y, z, distance: distances[key] };
        }).filter(block => block.distance <= this.radius); // Ensure only blocks within the radius are returned
    }
    
    
    addNeighborsToOpenSet(current, openSet, closedSet, distances) {
        const { x, y, z } = current;
        const neighbors = this.getNeighborPositions(x, y, z);
    
        neighbors.forEach(({ dx, dy, dz }) => {
            let neighborX = x + dx, neighborY = y + dy, neighborZ = z + dz;
            let neighborKey = `${neighborX},${neighborY},${neighborZ}`;
            if (!closedSet.has(neighborKey) && this.isMovable(x, y, z, dx, dy, dz)) {
                let newDistance = distances[`${x},${y},${z}`] + 1;
                if (!openSet.some(o => `${o.x},${o.y},${o.z}` === neighborKey)) {
                    openSet.push({ x: neighborX, y: neighborY, z: neighborZ, distance: newDistance });
                }
            }
        });
    }

    getNeighborPositions(x, y, z) {
        let positions = [];
        for (let dz of [-1, 0, 1]) {
            for (let dy of [-1, 0, 1]) {
                for (let dx of [-1, 0, 1]) {
                    if (dx || dy || dz) { // Exclude the current block
                        positions.push({ dx, dy, dz });
                    }
                }
            }
        }
        return positions;
    }
    
    isMovable(currX, currY, currZ, dx, dy, dz) {
        const targetBlockExists = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz}`];
        const oneSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 1}`];
        const twoSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 2}`];
    
        return targetBlockExists && !oneSpaceAbove && !twoSpaceAbove;
    }
}