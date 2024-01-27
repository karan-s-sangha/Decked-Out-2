class Animator {
    constructor(game, spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { game, spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

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

           // console.log("Drawing frame at:", this.xStart, x, y, "with frame index:", this.width * scale , this.height * scale, frame);

    };
    drawMap(tick, ctx, x , y) {
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

                (this.game.camera.cameraX)/this.game.GameScale + frame * (this.width + this.framePadding),
                (this.game.camera.cameraY)/this.game.GameScale, 
                this.game.ctx.canvas.width/this.game.GameScale, this.game.ctx.canvas.height/this.game.GameScale, 
    
                0, y * this.game.GameScale, 
                this.game.ctx.canvas.width, this.game.ctx.canvas.height, 
                );
           // console.log("Drawing frame at:", this.xStart, x, y, "with frame index:", this.width * scale , this.height * scale, frame);

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
        if(this.width > this.height) {
            offscreenCanvas.width = this.width * scale;
            offscreenCanvas.height = this.width * scale;
        } else {
            offscreenCanvas.width = this.height * scale;
            offscreenCanvas.height = this.height * scale;
        }
        

        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCanvas.width/2, offscreenCanvas.height/2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(-offscreenCanvas.width/2 , -offscreenCanvas.height/2);
        offscreenCtx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart 
                               ,this.width,this.height, (offscreenCanvas.width - (this.width * scale)) / 2
                               ,(offscreenCanvas.width - (this.height * scale)) / 2, this.width * scale, this.height * scale);
        offscreenCtx.restore();
        ctx.drawImage(offscreenCanvas, x, y);
       

       

    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};