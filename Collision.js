class Collision {
    constructor(game){
        this.game = game;
    }

    // Function to check the collision
    isCollision(x, y) {

        let image = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png"];
        this.x = x / this.game.scale;
        this.y = y / this.game.scale;
        // Create a temporary canvas
        let canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 2;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0,image.width*this.game.scale,image.height*this.game.scale );

        // Check the values of x and y
        //console.log("x:", x);
        //console.log("y:", y);

        // Ensure the coordinates are within the bounds of the canvas
        if (this.x >= 0 && this.x < image.width && this.y >= 0 && this.y < image.height) {
            // Get the pixel data from the temporary canvas
            let pixelData = context.getImageData(Math.floor(this.x), Math.floor(this.y), 1, 1).data;
            let pixelColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            console.log("x: " + this.x + " y: " + this.y);
            console.log(pixelColor);
            let collisionColor = "rgba(116,29,50)"; // Corrected the collision color

            if (pixelColor === collisionColor) {
                return true; // Collision detected
            } else {
                return false; // No collision
            }
        } else {
            console.error("Coordinates are out of bounds.");
            return false; // Return false for out-of-bounds coordinates
        }
        
    };
}
