class Compass {
    constructor(artifact, steve){
        this.artifact = artifact;
        this.steve = steve;
        this.axisX = 0;
        this.axisY = 0;
        this.artX = 0;
        this.artY = 0;

        this.drawX = 0;
        this.drawY = 0;
        this.cashe = [];

        this.image = ASSET_MANAGER.cache["./Art/Arrow.png"];
        this.scale = 1;
        this.angleRadians = 0;
        this.radius =5;
    }

    // Function to check the collision
    update(axisX, axisY, artX, artY ) {
        this.axisX = this.steve.x;
        this.axisY = this.steve.y;
 
        this.artX = this.artifact.getX;
        this.artY = this.artifact.getY;

        this.angleRadians =  findAngleBetweenLines(axisX, axisY, axisX, axisY-10, axisX, axisY, artX, artY);
        this.angleRadians = this.angleRadians % (2*Math.PI);

        // Calculate the new coordinates
        this.drawX = axisX + this.radius * Math.cos(angleRadians);
        this.drawY = axisY + this.radius * Math.sin(angleRadians);


    };
    draw(ctx) {
       
        drawAngle(ctx, this.angleRadians * (180/Math.PI) , this.scale);
        
    };
    drawAngle(ctx, angle, scale){
        // Make sure it's a valid angle.
        if(angle < 0 || angle > 359) {
            return;
        }

         /*
        We will rotate the image by first rotate the entire canvas then keep the steve
        and rotate back the background. However, this process is very expensive so we 
        will minimize it by creating array that stores canvas of all 360 degree angles.

        This is the reason we had to convert radian into degree. Further explanation can be
        seen from Chris's lecture.
        */
        if(!this.cashe[angle]) {
            let radian = angle / 360 * 2 * Math.PI;
            var offscreenCanvas = document.createElement('canvas');

            if(this.image.width > this.image.height) {
                offscreenCanvas.width = this.image.width * scale;
                offscreenCanvas.height = this.image.width * scale;
            } else {
                offscreenCanvas.width = this.image.height * scale;
                offscreenCanvas.height = this.image.height * scale;
            }

            var offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.save();
            offscreenCtx.translate(offscreenCanvas.width/2, offscreenCanvas.height/2);
            offscreenCtx.rotate(radian);
            offscreenCtx.translate(-offscreenCanvas.width/2 , -offscreenCanvas.height/2);
            offscreenCtx.drawImage(this.image, (offscreenCanvas.width - (this.image.width * scale)) / 2
                                   ,(offscreenCanvas.width - (this.image.height * scale)) / 2, this.image.width * scale, this.image.height * scale);
            offscreenCtx.restore();
            offscreenCtx.save();

            // Debug
            // offscreenCtx.strokeStyle="red";
            // offscreenCtx.strokeRect(0,0,offscreenCanvas.width, offscreenCanvas.height);

            this.cashe[angle] = offscreenCanvas;

        }
        ctx.drawImage(this.cashe[angle],this.drawX - this.cashe[angle].width / 2, this.drawY - this.cashe[angle].height / 2);
    }
 
    calculateSlope(x1, y1, x2, y2) {
        return (y2 - y1) / (x2 - x1);
    }
    
    findAngleBetweenLines(x1, y1, x2, y2, x3, y3, x4, y4) {
        let m1 = calculateSlope(x1, y1, x2, y2);
        let m2 = calculateSlope(x3, y3, x4, y4);
    
        let angleRadians = Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2)));
        //let angleDegrees = angleRadians * (180 / Math.PI);
    
        return angleRadians;
    }
}
