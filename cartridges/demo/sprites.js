cartridge.sprites = {
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
};