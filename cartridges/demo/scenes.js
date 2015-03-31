cartridge.scenes = {
	first: {
		image: 'bg.png',
		width: 0,
		height: 0,
		timer: 0,
		init: function() {
			var ruffles = cartridge.sprites.ruffles;
			ruffles.state = 'walking';
			ruffles.visible = 'true';
			ruffles.x = -120;
			ruffles.y = 230;
		},
		logic: function(){
			var ruffles = cartridge.sprites.ruffles;
			var state = ruffles.states[ruffles.state];
			ruffles.x += state.speed;
			cartridge.scenes.first.timer++;
			var timeonscreen = 1000;
			if(ruffles.state == 'running') {
				timeonscreen = 360;
			}
			if(cartridge.scenes.first.timer > timeonscreen) {
				cartridge.scenes.first.timer = 0;
				ruffles.x = -120;
				if(ruffles.state == 'running') {
					ruffles.state = 'walking';
				} else {
					ruffles.state = 'running';
				}
			}
		}
	}
};