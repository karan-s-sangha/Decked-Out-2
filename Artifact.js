class Artifact  {
    constructor(game, steve) {
        this.game = game;
        this.steve = steve;
        this.item = new Item  (game, steve, [
            [950, 500], [750, 1500], [595, 1624], [372, 1588], [340, 1700],
            [177, 1442], [113, 1156], [126, 784], [1235, 1090], [1058, 980],
            [1050, 1284], [990, 1505], [890, 1294], [447, 930], [333, 1080],
            [997, 1390], [463, 1416], [865, 1000], [1115, 720]
        ], [
            "./Art/Artifacts/Axeofthescreaminvoid.png",
            "./Art/Artifacts/Butchersapron.png",
            "./Art/Artifacts/Chiselundead.png",
            "./Art/Artifacts/Deathloop.png",
            "./Art/Artifacts/Hoodofawyah.png",
            "./Art/Artifacts/Hornofthegoat.png",
            "./Art/Artifacts/Hypnoticbandana.png",
            "./Art/Artifacts/Jarofspeedyslime.png",
            "./Art/Artifacts/Le_waffle.png",
            "./Art/Artifacts/Papasslippers.png",
            "./Art/Artifacts/Pearlofcleansing.png",
            "./Art/Artifacts/Shadesofthedog.png",
            "./Art/Artifacts/Tomeofthehills.png"
        ]);
    }
    update(){
        this.item.update();
        if(this.item.picked) {
            this.steve.win = true;
            this.game.play = false;
        }
    }
    draw(ctx){
        this.item.draw(ctx);
    }
}

//----------  DO NOT DELETE --------------------

// this.imageValue = {
//     "./Art/Artifacts/Axeofthescreaminvoid.png": 7,
//     "./Art/Artifacts/Butchersapron.png": 20,
//     "./Art/Artifacts/Chiselundead.png": 19,
//     "./Art/Artifacts/Deathloop.png": 13,
//     "./Art/Artifacts/Hoodofawyah.png" : 6,
//     "./Art/Artifacts/Hornofthegoat.png" : 18,
//     "./Art/Artifacts/Hypnoticbandana.png": 21,
//     "./Art/Artifacts/Jarofspeedyslime.png": 11,
//     "./Art/Artifacts/Le_waffle.png": 8,
//     "./Art/Artifacts/Papasslippers.png": 10,
//     "./Art/Artifacts/Pearlofcleansing.png": 14,
//     "./Art/Artifacts/Shadesofthedog.png": 9,
//     "./Art/Artifacts/Tomeofthehills.png": 12
// };
