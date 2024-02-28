class StaticArt {
    constructor(game) {
        this.game = game;
        this.radius = 12; // Radius for drawing and calculations
    }
    
    update() {
        // Placeholder for future update logic
    }

    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.floor(this.game.camera.steve.playerZ);

        let reachableBlocks = this.getReachableBlocks(playerX, playerY, playerZ);
        let blocksInRange = this.getBlocksInRange(playerX, playerY, playerZ);

        // Filter out blocks in reachableBlocks from blocksInRange to avoid duplicates
        blocksInRange = blocksInRange.filter(({ x, y, z }) => 
            !reachableBlocks.some(block => block.x === x && block.y === y && block.z === z));

        // Sort and combine blocks for drawing
        [...blocksInRange, ...reachableBlocks]
            .sort((a, b) => a.z - b.z || a.x - b.x || a.y - b.y)
            .forEach(block => this.drawBlock(ctx, block.x, block.y, block.z));
    }

    drawBlock(ctx, x, y, z) {
        const { playerX, playerY, playerZ, isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor } = this.getDrawingParams();
        const blockKey = `${x},${y},${z}`;
        const block = this.game.camera.blocksMap[blockKey];
        const blockImage = block ? ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`] : null;

        if (!block || !blockImage) return;

        let isoX = ((x - y) * imageWidth * sizeFactor / 2) - (isoCameraX) - (imageWidth * sizeFactor)/2;
        let isoY = ((x + y) * imageHeight * sizeFactor / 4) - (z - playerZ) * imageHeight * sizeFactor / 2 - isoCameraY + (imageHeight*sizeFactor)/4;

        ctx.drawImage(blockImage, isoX, isoY, imageWidth * sizeFactor, imageHeight * sizeFactor);
    }

    getBlocksInRange(playerX, playerY, playerZ) {
        let blocksInRange = [];
        for (let z = playerZ - 5; z <= playerZ + 5; z++) {
            for (let y = playerY - this.radius; y <= playerY + this.radius; y++) {
                for (let x = playerX - this.radius; x <= playerX + this.radius; x++) {
                    if (this.game.camera.blocksMap[`${x},${y},${z}`]) {
                        blocksInRange.push({ x, y, z });
                    }
                }
            }
        }
        return blocksInRange;
    }

    getDrawingParams() {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.ceil(this.game.camera.steve.playerZ);
        const { isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor } = this.game.camera;
        return { playerX, playerY, playerZ, isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor };
    }

    getReachableBlocks(playerX, playerY, playerZ) {
        const radius = this.radius;
        let startBlockX = Math.floor(playerX);
        let startBlockY = Math.floor(playerY);
        let startBlockZ = Math.floor(playerZ);
    
        let openSet = [{ x: startBlockX, y: startBlockY, z: startBlockZ, distance: 0 }];
        let closedSet = new Set(); // Stores only the coordinates as a string "x,y,z"
        let distances = {}; // Stores distances for each block
    
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.distance - b.distance);
            let current = openSet.shift();
            let currentKey = `${current.x},${current.y},${current.z}`;
            if (!closedSet.has(currentKey)) { // Ensure we only add unique blocks
                closedSet.add(currentKey);
                distances[currentKey] = current.distance; // Track distance separately
    
                for (let dz of [-1, 0, 1]) {
                    for (let dy of [-1, 0, 1]) {
                        for (let dx of [-1, 0, 1]) {
                            if (dx === 0 && dy === 0 && dz === 0) continue;
    
                            let neighborX = current.x + dx;
                            let neighborY = current.y + dy;
                            let neighborZ = current.z + dz;
    
                            if (Math.abs(neighborX - startBlockX) > radius ||
                                Math.abs(neighborY - startBlockY) > radius ||
                                Math.abs(neighborZ - startBlockZ) > radius) continue;
    
                            let neighborKey = `${neighborX},${neighborY},${neighborZ}`;
                            if (closedSet.has(neighborKey) || !this.isMovable(current.x, current.y, current.z, dx, dy, dz)) continue;
    
                            let existing = openSet.find(o => `${o.x},${o.y},${o.z}` === neighborKey);
                            let newDistance = current.distance + 1;
                            if (!existing) {
                                openSet.push({ x: neighborX, y: neighborY, z: neighborZ, distance: newDistance });
                            }
                        }
                    }
                }
            }
        }
    
        // Convert closedSet to an array of objects including distance for further processing
        return Array.from(closedSet).map(key => {
            let [x, y, z] = key.split(',').map(Number);
            return { x, y, z, distance: distances[key] };
        });
    }
    
    isMovable(currX, currY, currZ, dx, dy, dz) {
        // Check for the existence of the block in the target location
        let targetBlockExists = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz}`];
        // Check if there are two blocks of free space above the target location for Steve to stand
        let oneSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 1}`];
        let twoSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 2}`];
    
        // // For falling down (dz = -1), ensure the destination block below is clear
        // if (dz === -1) {
        //     // Only need to check the block directly below is not existing (Steve can fall into it)
        //     return !this.game.camera.blocksMap[`${currX},${currY},${currZ - 1}`];
        // }
    
        return targetBlockExists && !oneSpaceAbove && !twoSpaceAbove;
    }
    
}