class FrostEmbers  {
    constructor(game, steve) {
        this.item = new Item  (game, steve, [
            [669, 1776], [318, 1700], [168, 1466], [228, 1204], [270, 880],
            [334, 572], [262, 340], [208, 162], [759, 1636], [435, 1032],
            [446, 938], [980, 1430], [830, 1260], [1138, 1168], [1212, 850],
            [1080, 536], [792, 526]
        ], [
            "./Art/Currency/Frost-Ember.png",
        ]);
    }
    update(){
        this.item.update();
    }
    draw(ctx){
        this.item.draw(ctx);
    }
    addItem(){
        this.item.AddItem();
    }
}