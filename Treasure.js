
class Treasure  {
    constructor(game, steve) {
        this.item = new Item  (game, steve, [
            [678, 1778], [332, 1700], [172, 1452], [230, 1215], [260, 894],
            [352, 578], [254, 332], [196, 170], [761, 1620], [426, 1030],
            [438, 932], [970, 1420], [836, 1251], [1130, 1166], [1206, 844],
            [1070, 530], [788, 512]
        ], [
            "./Art/Currency/Coin.png",
            "./Art/Currency/Crown.png",
        ]);
    }
    update(){
        //this.item.AddItem();
        this.item.update();
    }
    draw(ctx){
        this.item.draw(ctx);
    }
}