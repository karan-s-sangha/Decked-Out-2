
var ASSET_MANAGER = new AssetManager();

// spritesheets

ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/Level_1_UpperView.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png");


ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/water.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/candles.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/enchanttable.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/fire.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/firecamp.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/fireinhall.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/lava.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/smokeinhallright.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/smokeinhallleft.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/ravager-attacking.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/ravager-walking-running.png");
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/mario.png");



// // music
// ASSET_MANAGER.queueDownload("./music/overworld.mp3");
// ASSET_MANAGER.queueDownload("./music/underworld.mp3");
// ASSET_MANAGER.queueDownload("./music/overworld-hurry.mp3");
// ASSET_MANAGER.queueDownload("./music/underworld-hurry.mp3");

// // sound effects
// ASSET_MANAGER.queueDownload("./audio/small-jump.mp3");
// ASSET_MANAGER.queueDownload("./audio/super-jump.mp3");
// ASSET_MANAGER.queueDownload("./audio/stomp.mp3");
// ASSET_MANAGER.queueDownload("./audio/block.mp3");
// ASSET_MANAGER.queueDownload("./audio/bump.wav");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	// ASSET_MANAGER.autoRepeat("./music/overworld.mp3");
	// ASSET_MANAGER.autoRepeat("./music/underworld.mp3");
	// ASSET_MANAGER.autoRepeat("./music/overworld-hurry.mp3");
	// ASSET_MANAGER.autoRepeat("./music/underworld-hurry.mp3");

	//PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;  // used for scaling the map

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	//PARAMS.CANVAS_WIDTH = canvas.width;
	//PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);
		
	new SceneManager(gameEngine);

	gameEngine.start();
});