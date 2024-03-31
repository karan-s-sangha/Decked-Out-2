class Compass {
    constructor(artifact, steve, game) {
        this.artifact = artifact;

        this.steve = steve;
        this.game = game;
        this.playerX = this.steve.playerX;
        this.playerY = this.steve.playerY;
        this.screenX = this.game.ctx.canvas.width / 2;
        this.screenY = this.game.ctx.canvas.height / 2;
        this.artX = artifact.item.getX();
        this.artY = artifact.item.getY();

        this.cache = [];

        this.image = ASSET_MANAGER.cache["./Art/RedArrow.png"];
        this.scale = 0.5;
        this.angleRadians = 0;
        this.angleDegree = 0;
        this.radius = 60;
    }

    // Function
    update() {
        //console.log("compass");

        this.playerX = this.steve.playerX;
        this.playerY = this.steve.playerY;
        this.playerZ = this.steve.playerZ;

        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

        let isoX = ((this.playerX - this.playerY) * blockWidth) / 2 - this.game.camera.isoCameraX;
        let isoY = ((this.playerX + this.playerY) * blockHeight) / 4 - ((this.playerZ - this.steve.playerZ) * blockWidth) / 2
            - this.game.camera.isoCameraY + blockHeight / 2;

        this.playerX = isoX;
        this.playerY = isoY;

        this.angleRadians = this.findAngle(
            this.playerX, this.playerY,
            this.artifact.item.itemIsoX, this.artifact.item.itemIsoY);
        this.drawX = 0;
        this.drawY = 0;

        // Calculate the new coordinates for drawing the arrow
        this.drawX = this.screenX + this.radius * Math.cos(this.angleRadians);
        this.drawY = this.screenY + this.radius * Math.sin(this.angleRadians);

    }
    draw(ctx) {
        // ctx.fillStyle = 'red';
        //console.log("Drawing the compass");

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