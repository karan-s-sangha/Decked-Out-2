
var ASSET_MANAGER = new AssetManager();

// Image for the Upper Level One
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/Level_1_UpperView.png");

// Image for the Upper Level One Collision
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png");

// Animation for the Upper Level One
ASSET_MANAGER.queueDownload("./Art/Level_1_UpperView_Art/Animation.png");


// Animation for the Ravager
ASSET_MANAGER.queueDownload("./Art/Ravager_Animations/ravager-walking-running.png");
ASSET_MANAGER.queueDownload("./Art/Ravager_Animations/Ravager-standing.png");
ASSET_MANAGER.queueDownload("./Art/Ravager_Animations/ravager-attacking.png");

// Animation for the Steve
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - walking-sideways.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - walking.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - standing.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - running-sideways.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - running.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - crouching-sideways.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - crouching.png");
ASSET_MANAGER.queueDownload("./Art/Steve_Animations/player - crouched.png");
ASSET_MANAGER.queueDownload("./Art/Player/health.png");

// Image for the compass
ASSET_MANAGER.queueDownload("./Art/RedArrow.png");

//Image for the Artifacts
ASSET_MANAGER.queueDownload("./Art/Artifacts/Axeofthescreaminvoid.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Butchersapron.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Chiselundead.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Deathloop.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Hoodofawyah.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Hornofthegoat.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Hypnoticbandana.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Jarofspeedyslime.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Le_waffle.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Papasslippers.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Pearlofcleansing.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Shadesofthedog.png");
ASSET_MANAGER.queueDownload("./Art/Artifacts/Tomeofthehills.png");


//Image for the Currency
ASSET_MANAGER.queueDownload("./Art/Currency/Crown.png");
ASSET_MANAGER.queueDownload("./Art/Currency/Coin.png");
ASSET_MANAGER.queueDownload("./Art/Currency/Frost-Ember.png");



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