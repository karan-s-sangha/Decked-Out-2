class Animator {
    constructor(game, spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { game, spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.offscreenCanvas = null;
    }

    updateElapsedTime(tick) {
        this.elapsedTime += tick;
        if (this.isAnimationDone()) {
            if (this.loop) {
                this.elapsedTime %= this.totalTime;
            } else {
                return true; // Indicate no drawing is needed
            }
        }
        return false; // Indicate drawing is needed
    }

    getCurrentFrame() {
        let frame = Math.floor(this.elapsedTime / this.frameDuration);
        return this.reverse ? this.frameCount - frame - 1 : frame;
    }

    drawFrame(tick, ctx, x, y, scale) {
        if (this.updateElapsedTime(tick)) return;

        let frame = this.getCurrentFrame();
        ctx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart, this.width, this.height, x, y, this.width * scale, this.height * scale);
    }

    drawMap(tick, ctx, x, y) {
        if (this.updateElapsedTime(tick)) return;

        let frame = this.getCurrentFrame();
        ctx.drawImage(this.spritesheet, (this.game.camera.cameraX) / this.game.GameScale + frame * (this.width + this.framePadding), (this.game.camera.cameraY) / this.game.GameScale, this.game.ctx.canvas.width / this.game.GameScale, this.game.ctx.canvas.height / this.game.GameScale, 0, y * this.game.GameScale, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }

    initializeOffscreenCanvas(scale) {
        if (!this.offscreenCanvas) {
            this.offscreenCanvas = document.createElement('canvas');
            let maxDimension = Math.max(this.width, this.height) * scale;
            this.offscreenCanvas.width = this.offscreenCanvas.height = maxDimension;
        }
    }

    drawFrameAngle(tick, ctx, x, y, scale, angle) {
        if (this.updateElapsedTime(tick)) return;

        this.initializeOffscreenCanvas(scale);
        let frame = this.getCurrentFrame();
        let offscreenCtx = this.offscreenCanvas.getContext('2d');

        offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        offscreenCtx.save();
        offscreenCtx.translate(this.offscreenCanvas.width / 2, this.offscreenCanvas.height / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(-this.offscreenCanvas.width / 2, -this.offscreenCanvas.height / 2);
        offscreenCtx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart, this.width, this.height, (this.offscreenCanvas.width - this.width * scale) / 2, (this.offscreenCanvas.height - this.height * scale) / 2, this.width * scale, this.height * scale);
        offscreenCtx.restore();
        ctx.drawImage(this.offscreenCanvas, x - this.offscreenCanvas.width / 2, y - this.offscreenCanvas.height / 2);
    }

    isAnimationDone() {
        return this.elapsedTime >= this.totalTime;
    }
}
