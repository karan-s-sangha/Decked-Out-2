class Collision {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this; // Ensure this is intentional
    }

    // Function to get color of a pixel
    isCollision(x, y) {

        let pixelData = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png"].getImageData(x, y, 1, 1).data;
        let pixelColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]/255})`;

        let collsionColor = "rgba(116,29,50,255)";
        return pixelColor == collsionColor;
    }
}