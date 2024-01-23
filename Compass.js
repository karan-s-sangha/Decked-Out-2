class Compass {
    constructor(artifact, steve, game) {
        this.artifact = artifact;
        this.steve = steve;
        this.game = game;
        this.axisX = 0;
        this.axisY = 0;
        this.artX = 0;
        this.artY = 0;

        this.drawX = this.steve.x;
        this.drawY = this.steve.y;
        this.cache = [];

        this.image = ASSET_MANAGER.cache["./Art/Arrow.png"];
        this.scale = 0.1;
        this.angleRadians = 0;
        this.angleDegree = 0;
        this.radius = 70;
    }

    // Function
    update() {
        this.axisX = this.steve.playerX;
        this.axisY = this.steve.playerY;
    
        this.artX = this.artifact.getX();
        this.artY = this.artifact.getY();
    
        this.angleRadians = this.findAngle(
            this.steve.playerX, this.steve.playerY,
            this.artifact.getX(), this.artifact.getY()
        );
    
        this.drawX = 0;
        this.drawY = 0;
    
        // Calculate the new coordinates for drawing the arrow
        this.drawX = this.steve.screenX + this.radius * Math.cos(this.angleRadians);
        this.drawY = this.steve.screenY + this.radius * Math.sin(this.angleRadians);
    
        }
    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.artX + this.game.cameraWorldTopLeftX, this.artY + this.game.cameraWorldTopLeftY, 20, 20);
        this.angleDegree = Math.floor(this.angleRadians * (180 / Math.PI));
    
        this.drawAngle(ctx, this.angleDegree, this.scale);
    }
    

    drawAngle(ctx, angle, scale) {
       
        if (!this.cache[angle]) {
            let radian = angle / 360 * 2 * Math.PI;
            var offscreenCanvas = document.createElement('canvas');

            if (this.image.width > this.image.height) {
                offscreenCanvas.width = this.image.width * scale;
                offscreenCanvas.height = this.image.width * scale;
            } else {
                offscreenCanvas.width = this.image.height * scale;
                offscreenCanvas.height = this.image.height * scale;
            }

            var offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.save();
            offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
            offscreenCtx.rotate(radian);
            offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
            offscreenCtx.drawImage(this.image, (offscreenCanvas.width - (this.image.width * scale)) / 2,
                                   (offscreenCanvas.height - (this.image.height * scale)) / 2, this.image.width * scale, this.image.height * scale);
            offscreenCtx.restore();

            this.cache[angle] = offscreenCanvas;
        }
        ctx.drawImage(this.cache[angle], this.drawX - this.cache[angle].width / 2, this.drawY - this.cache[angle].height / 2);
    }

    // Find the angle in radians towards a target point from the player's position
    findAngle(playerX, playerY, targetX, targetY) {
        return Math.atan2(targetY - playerY, targetX - playerX);
    }
}
