class Artifact {
    constructor(game){
        this.x = 0;
        this.y = 0;
        this.levelOneArtifacts = [[950, 500],
        [750, 1500],
        [595, 1624],
        [372, 1588],
        [340, 1700],
        [177, 1442],
        [113, 1156],
        [126, 784],
        [1235, 1090],
        [1058, 980],
        [1050, 1284],
        [990, 1505],
        [890, 1294],
        [447, 930],
        [333, 1080],
        [997, 1390],
        [463, 1416],
        [865, 1000],
        [1115, 720]];
        this.image = ASSET_MANAGER.cache["./Art/Artifacts/Hoodofawyah.png"];
        this.getRandomArtifact();
    }

    getRandomArtifact(){
        // Select a random pair from levelOneArtifacts
        let randomIndex = Math.floor(Math.random() * this.levelOneArtifacts.length);
        let selectedArtifact = this.levelOneArtifacts[randomIndex];

        // Assign the values to x and y
        this.x = selectedArtifact[0];
        this.y = selectedArtifact[1];
    }
    update() {
       
    
        }
    draw(ctx) {
        
    }
    

    drawAngle() {
       
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}
