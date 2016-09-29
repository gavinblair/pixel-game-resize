var cartridge = {
	settings: {
		sourcewidth: 500,
		sourceheight: 100,
		camwidth: 160,
		camheight: 100,
		destwidth: 800,
		destheight: 500
	},
	scenes: {},
	currentscene: 'first',
	sprites: {},
	init: {
		$.getScript("sprites.js", function(){
		});
		$.getScript("scenes.js", function(){
			cartridge.scenes[cartridge.currentscene].init();
		});
	}
};