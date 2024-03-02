class StaticArt {
    constructor(game) {
        this.game = game;
        this.radiusXY = 15; // Radius for drawing and calculations in the XY plane
        this.radiusZ = 5;  // Radius for drawing and calculations in the Z dimension
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

    expandAroundSteve(playerX, playerY, playerZ) {
        const visited = new Set();
        const queue = [{ x: playerX, y: playerY, z: playerZ }];
        const blocksInRange = [];

        while (queue.length > 0) {
            const { x, y, z } = queue.shift();
            const key = `${x},${y},${z}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (Math.abs(x - playerX) <= this.radiusXY && Math.abs(y - playerY) <= this.radiusXY && Math.abs(z - playerZ) <= this.radiusZ) {
                const block = this.game.camera.blocksMap[key];
                if (block) {
                    blocksInRange.push(block);

                    this.getNeighborPositions(x, y, z).forEach(({ dx, dy, dz }) => {
                        const newPos = { x: x + dx, y: y + dy, z: z + dz };
                        const newKey = `${newPos.x},${newPos.y},${newPos.z}`;
                        if (!visited.has(newKey)) {
                            queue.push(newPos);
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
        return neighbors;
    }
}