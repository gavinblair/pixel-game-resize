var cartridge = {
	settings: {
		sourcewidth: 500,
		sourceheight: 100,
		camwidth: 160,
		camheight: 100,
		destwidth: 800,
		destheight: 500
	},
	scenes: {
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
				ruffles.y = 30;
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
	},
	currentscene: 'first',
	sprites: {
		ruffles: {
			state: 'walking',
			visible: false,
			x: 0,
			y: 0,
			follow: true,
			states: {
				walking: {
					image: 'walk.png',
					width: 80,
					height: 60,
					frames: 24,
					rate: 0.41,
					speed: .65,
					currentframe: 0,
				},
				running: {
					image: 'run.png',
					width: 48,
					height: 57,
					frames: 12,
					rate: 0.35,
					speed: 1/0.49,
					currentframe: 0,
				}
			},

		}
	},
};