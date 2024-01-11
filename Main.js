
var ASSET_MANAGER = new AssetManager();

// spritesheets
ASSET_MANAGER.queueDownload("Level_1_LowerView.png");
ASSET_MANAGER.queueDownload("Level_1_MiddleView.png");
ASSET_MANAGER.queueDownload("Level_1_UpperView.png");


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

	//PARAMS.CANVAS_WIDTH = canvas.width;
	//PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);
		
	//new SceneManager(gameEngine);

	gameEngine.start();
});