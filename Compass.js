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
        this.scale = 0.4;
        this.angleRadians = 0;
        this.radius = 10;
    }

    // Function
    update(axisX, axisY, artX, artY) {
       
        this.axisX = this.steve.playerX;
        this.axisY = this.steve.playerY;
 
        //console.log(this.axisX);
        //console.log(this.axisY);

 
        this.artX = this.artifact.getX();
        this.artY = this.artifact.getY();
        //console.log(this.artX);
        //console.log(this.artY);

        // Update the angle pointing towards the artifact
        this.angleRadians = this.findAngle(
        this.steve.playerX, this.steve.playerY,
        this.artifact.getX(), this.artifact.getY());        
      
        console.log(this.angleRadians * (180 / Math.PI));
        // Calculate the new coordinates
        this.drawX +=  this.steve.screenX + this.radius * Math.cos(this.angleRadians);
        this.drawY +=  this.steve.screenY + this.radius * Math.sin(this.angleRadians);
    }

    draw(ctx) {
        // Set the color of the square
        ctx.fillStyle = 'red';

        // Draw the squaresd
        ctx.fillRect(this.artX + this.game.camreaWorldTopLeftX , this.artY + this.game.camreaWorldTopLeftY  , 20, 20);
        console.log("x "+ this.artX + this.game.camreaWorldTopLeftX)
        console.log("y "+ this.artY + this.game.camreaWorldTopLeftY)

        this.drawAngle(ctx, this.angleRadians * (180 / Math.PI), this.scale);
        //console.log("Trying to draw the compass");
    }

    drawAngle(ctx, angle, scale) {
        if (angle < 0 || angle > 359) {
            return;
        }
        //angle = 180;
        //console.log("angle",angle);
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

    calculateSlope(x1, y1, x2, y2) {
        if (x2 - x1 === 0) return Infinity; // Avoid division by zero
        return (y2 - y1) / (x2 - x1);
    }

    // Find the angle in radians towards a target point from the player's position
    findAngle(playerX, playerY, targetX, targetY) {
        return Math.atan2(targetY - playerY, targetX - playerX);
    }
}
