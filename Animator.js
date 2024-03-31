class Animator {
    constructor(game, spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        // Assign properties
        Object.assign(this, { game, spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

        // Initialize time properties
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.cache = [0]; // Cache for optimization, not used in this version
    }

    // Draw a single frame of the animation
    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return; // Stop if not looping
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1; // Adjust frame index if animation is reversed

        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, // Source from sprite sheet
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);
    }

    // Draw the animation on a map
    drawMap(tick, ctx, x, y) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return; // Stop if not looping
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1; // Adjust frame index if animation is reversed

        ctx.drawImage(this.spritesheet,
            (this.game.camera.cameraX) / this.game.GameScale + frame * (this.width + this.framePadding),
            (this.game.camera.cameraY) / this.game.GameScale,
            this.game.ctx.canvas.width / this.game.GameScale, this.game.ctx.canvas.height / this.game.GameScale,
            0, y * this.game.GameScale,
            this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }

    // Draw the animation with a specified angle
    drawFrameAngle(tick, ctx, x, y, scale, angle) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return; // Stop if not looping
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1; // Adjust frame index if animation is reversed

        // Create an offscreen canvas for rotating the sprite
        var offscreenCanvas = document.createElement('canvas');
        if (this.width > this.height) {
            offscreenCanvas.width = this.width * scale;
            offscreenCanvas.height = this.width * scale;
        } else {
            offscreenCanvas.width = this.height * scale;
            offscreenCanvas.height = this.height * scale;
        }

        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
        offscreenCtx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart,
            this.width, this.height, (offscreenCanvas.width - (this.width * scale)) / 2,
            (offscreenCanvas.width - (this.height * scale)) / 2, this.width * scale, this.height * scale);
        offscreenCtx.restore();

        // Draw the rotated sprite onto the main canvas
        ctx.drawImage(offscreenCanvas, x - offscreenCanvas.width / 2, y - offscreenCanvas.height);
    }

    // Get the current frame index based on elapsed time
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    // Check if the animation is completed
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}