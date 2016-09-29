cartridge.scenes = {
	first: {
		image: 'bg.png',
		width: 0,
		height: 0,
		init: function() {
			var ruffles = cartridge.sprites.ruffles;
			ruffles.state = 'walking';
			ruffles.visible = 'true';
			ruffles.x = -120;
			ruffles.y = 150;
		},
		logic: function(){
			
		}
	}
};