var app = {
	time: 0,
	canvas: {},
	height: 0,
	width: 0,
	camera: {
		x: 0,
		y: 0
	},
	init: function(){
		//disable scrolling
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', function(e){e.preventDefault(); return false;}, false);
		}
		window.onmousewheel = document.onmousewheel = function(e){e.preventDefault(); return false;};
		window.onscroll = function(e){e.preventDefault(); return false;};
		app.height = $(window).height();
		app.width = $(window).width();
		$('#game').attr('height', cartridge.settings.sourceheight);
		$('#game').attr('width', cartridge.settings.sourcewidth);
		$('#resized').attr('height', app.height);
		$('#resized').attr('width', app.width);

		app.canvas = document.getElementById("game").getContext('2d');
		app.canvas.mozImageSmoothingEnabled = false;
		app.canvas.msImageSmoothingEnabled = false;
		app.canvas.imageSmoothingEnabled = false;

		app.loop();
		cartridge.scenes[cartridge.currentscene].init();
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
		var ratio = app.width / app.height;
		cartridge.settings.camwidth = cartridge.settings.camheight * ratio;
		upscaledCanvas.drawImage(app.canvas.canvas, app.camera.x, app.camera.y, cartridge.settings.camwidth, cartridge.settings.camheight, 0, 0, app.width, app.height);

	}
};