class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.cashe = [0];
    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
       
        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);
    };

    drawFrameAngle(tick, ctx, x, y, scale, angle) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
       

        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 64;
        offscreenCanvas.height = 64;
        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(12,28);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(-12,-28);
        offscreenCtx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart, 12, 16, 0, 13, 24,32);
        offscreenCtx.restore();
        ctx.drawImage(offscreenCanvas,x+4, y-12, 64, 64);
        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, 32, 32);

    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
