class Collision {
    constructor(game){
        this.game = game;
    }

    // Function to check the collision
    isCollision(x, y) {

        let image = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png"];
        
        // Create a temporary canvas
        let canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 2;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0,image.width*this.game.scale,canvas.height*this.game.scale );

        // Check the values of x and y
        //console.log("x:", x);
        //console.log("y:", y);

        // Ensure the coordinates are within the bounds of the canvas
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            // Get the pixel data from the temporary canvas
            let pixelData = context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
            let pixelColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`;

            let collisionColor = "rgba(116,29,50,255)"; // Corrected the collision color

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
