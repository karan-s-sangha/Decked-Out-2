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
        this.radius = 10;
    }

    // Function
    update(axisX, axisY, artX, artY) {
       
        this.axisX = -1 * this.game.x;
        this.axisY = -1 * this.game.y;
 

        console.log(this.axisX);
        console.log(this.axisY);

 
        this.artX = this.artifact.getX();
        this.artY = this.artifact.getY();
        //console.log(this.artX);
        //console.log(this.artY);

        this.angleRadians = this.findAngleBetweenLines(this.axisX, this.axisY, this.axisX, this.axisY - 10, this.axisX, this.axisY, this.artX, this.artY);
        //console.log(this.angleRadians);
        //this.angleRadians %= (2 * Math.PI);
        this.drawX = this.steve.x;
        this.drawY = this.steve.y;

        // Calculate the new coordinates
        this.drawX +=  this.radius * Math.cos(this.angleRadians);
        this.drawY +=  this.radius * Math.sin(this.angleRadians);
    }

    draw(ctx) {
        this.drawAngle(ctx, this.angleRadians * (180 / Math.PI), this.scale);
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

    findAngleBetweenLines(x1, y1, x2, y2, x3, y3, x4, y4) {
        let m1 = this.calculateSlope(x1, y1, x2, y2);
        let m2 = this.calculateSlope(x3, y3, x4, y4);

        if (m1 === Infinity && m2 === Infinity) return 0; // Parallel vertical lines
        if (m1 === Infinity || m2 === Infinity) return Math.PI / 2; // One vertical line

        let angleRadians = Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2)));
        return angleRadians;
    }
}
