var app = {
	time: 0,
	canvas: {},
	camera: {
		x: 0,
		y: 0
	},
	init: function(){
		app.canvas = document.getElementById("game").getContext('2d');
		app.canvas.mozImageSmoothingEnabled = false;
		app.canvas.msImageSmoothingEnabled = false;
		app.canvas.imageSmoothingEnabled = false;
		cartridge.scenes[cartridge.currentscene].init();
		app.loop();
	},
	loop: function(){
		requestAnimationFrame(app.loop);
		app.time++;
		//move sprites, etc.
		cartridge.scenes[cartridge.currentscene].logic();
		//draw scene
		var bg = new Image();
		bg.src = cartridge.scenes[cartridge.currentscene].image;
		app.canvas.drawImage(bg, 0, 0);
		//draw sprites
		for(var i in cartridge.sprites) {
			var sprite = cartridge.sprites[i];
			var state = sprite.states[sprite.state];
			if(sprite.visible) {
				state.currentframe+=state.rate;
				if(state.currentframe >= state.frames) {
					state.currentframe = 0;
				}
				var spriteimg = new Image();
				spriteimg.src = state.image;
				app.canvas.drawImage(
					spriteimg,
					Math.floor(state.currentframe)*state.width,
					0,
					state.width,
					state.height,
					sprite.x,
					sprite.y,
					state.width,
					state.height
				);
				if(sprite.follow) {
					app.camera.x = sprite.x - cartridge.settings.camwidth / 4;
					app.camera.y = sprite.y - cartridge.settings.camheight / 4;
					if (app.camera.x < 0) {
						app.camera.x = 0;
					}
					if (app.camera.x > cartridge.settings.sourcewidth - cartridge.settings.camwidth) {
						app.camera.x = cartridge.settings.sourcewidth - cartridge.settings.camwidth;
					}
					if (app.camera.y < 0) {
						app.camera.y = 0;
					}
					if (app.camera.y > cartridge.settings.sourceheight - cartridge.settings.camheight) {
						app.camera.y = cartridge.settings.sourceheight - cartridge.settings.camheight;
					}
				}
			}
		}
		//draw the big version
		app.resize();
	},
	resize: function(){
		var upscaledCanvas = document.getElementById('resized').getContext('2d');
		upscaledCanvas.mozImageSmoothingEnabled = false;
		upscaledCanvas.webkitImageSmoothingEnabled = false;
		upscaledCanvas.msImageSmoothingEnabled = false;
		upscaledCanvas.imageSmoothingEnabled = false;
		upscaledCanvas.drawImage(app.canvas.canvas, app.camera.x, app.camera.y, cartridge.settings.camwidth, cartridge.settings.camheight, 0, 0, cartridge.settings.destwidth, cartridge.settings.destheight);
	}
};