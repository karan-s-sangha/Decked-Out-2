class Compass {
    constructor(){
        this.axisX = 0;
        this.axisY = 0;
        this.artX = 0;
        this.artY = 0;
        this.drawX = 0;
        this.drawY = 0;
        this.image = ASSET_MANAGER.cache["./Art/Arrow.png"];

    }

    // Function to check the collision
    update(axisX, axisY, artX, artY ) {

        let angleRadians =  findAngleBetweenLines(axisX, axisY, axisX, axisY-10, axisX, axisY, artX, artY);

        // Calculate the new coordinates
        let drawX = axisX + distance * Math.cos(angleRadians);
        let drawY = axisY + distance * Math.sin(angleRadians);


    };
    draw(ctx) {
       
        let width = this.image.width;
        let height = this.image.height;
        ctx.drawImage(width-this.drawX, height -this.drawY , 30, 30)
        
        
    };
 
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
