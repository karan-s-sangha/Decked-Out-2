class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.frameRate = 0;
        this.frameCount = 0;
        this.frameRateInterval = 1; // Update the frame rate every second
        this.lastFrameRateUpdate = 0;
    };

    tick() {
        var current = Date.now();
        var delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        var gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        
        // Frame rate calculation
        this.frameCount++;
        if (current - this.lastFrameRateUpdate >= this.frameRateInterval * 1000) {
            this.frameRate = this.frameCount / (current - this.lastFrameRateUpdate) * 1000;
            this.lastFrameRateUpdate = current;
            this.frameCount = 0;
        }

        return gameDelta;
    };

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`FPS: ${this.frameRate.toFixed(2)}`, ctx.canvas.width - 10, 20);
    }
};
