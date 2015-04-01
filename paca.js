var paca = {
	time: 0,
	canvas: {},
	height: 0,
	width: 0,
	camera: {
		x: 0,
		y: 0,
		shakex: 0,
		shakey: 0
	},
	init: function(){
		//disable scrolling
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', function(e){e.preventDefault(); return false;}, false);
		}
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);

		//fastclick
    FastClick.attach(document.body);

		window.onmousewheel = document.onmousewheel = function(e){e.preventDefault(); return false;};
		window.onscroll = function(e){e.preventDefault(); return false;};
		paca.height = $(window).height();
		paca.width = $(window).width();
		$('#game').attr('height', cartridge.settings.sourceheight);
		$('#game').attr('width', cartridge.settings.sourcewidth);
		$('#resized').attr('height', paca.height);
		$('#resized').attr('width', paca.width);

		var ratio = paca.width / paca.height;
		cartridge.settings.camwidth = cartridge.settings.camheight * ratio;
		cartridge.settings.camwidth*=cartridge.settings.zoom;
		cartridge.settings.camheight*=cartridge.settings.zoom;

		paca.canvas = document.getElementById("game").getContext('2d');
		paca.canvas.mozImageSmoothingEnabled = false;
		paca.canvas.msImageSmoothingEnabled = false;
		paca.canvas.imageSmoothingEnabled = false;

		paca.loop();
		cartridge.scenes[cartridge.currentscene].init();

		$('#resized').click(function(e){
			//convert e.clientX
			var heightratio = $('#resized').height() / cartridge.settings.camheight;
			//convert e.clientY
			var widthratio = $('#resized').width() / cartridge.settings.camwidth;

			//find the sprite with 'follow'
			for(var i in cartridge.sprites) {
				if(cartridge.sprites[i].follow) {
					var sprite = cartridge.sprites[i];
					sprite.destination = {
						x: Math.floor(e.clientX / widthratio + paca.camera.x),
						y: Math.floor(e.clientY / heightratio + paca.camera.y)
					};
				}
			}
		});
	},
	loop: function(){
		requestAnimationFrame(paca.loop);
		paca.time++;
		paca.canvas.clearRect(0,0,paca.width,paca.height);
		//move sprites, etc.
		cartridge.scenes[cartridge.currentscene].logic();
		//draw scene
		var bg = new Image();
		bg.src = cartridge.scenes[cartridge.currentscene].image;
		paca.canvas.drawImage(bg, 0, 0);
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
				if(sprite.direction == 'right') {
					spriteimg.src = state.image;
				} else {
					spriteimg.src = state.reverse;
				}
				if(sprite.follow) {
					//moving?
					if(sprite.destination.x != -1) {
						if(sprite.destination.x > (Math.floor(sprite.x)+Math.floor(state.visiblewidth))) {
							sprite.x += state.speed;
							sprite.direction = 'right';
						} else if (sprite.destination.x < (Math.floor(sprite.x)+Math.floor(state.visiblewidth/2.5))) {
							sprite.x -= state.speed;
							sprite.direction = 'left';
						} else {
							sprite.destination.x = -1;
							sprite.destination.y = -1;
						}
					}
					//camera
					paca.camera.x = sprite.x - cartridge.settings.camwidth / 4;
					paca.camera.y = sprite.y - cartridge.settings.camheight / 4;
					if (paca.camera.x < 0) {
						paca.camera.x = 0;
					}
					if (paca.camera.x > cartridge.settings.sourcewidth - cartridge.settings.camwidth) {
						paca.camera.x = cartridge.settings.sourcewidth - cartridge.settings.camwidth;
					}
					if (paca.camera.y < 0) {
						paca.camera.y = 0;
					}
					if (paca.camera.y > cartridge.settings.sourceheight - cartridge.settings.camheight) {
						paca.camera.y = cartridge.settings.sourceheight - cartridge.settings.camheight;
					}
				}
				paca.canvas.drawImage(
					spriteimg,
					Math.floor(state.currentframe)*state.width,
					0,
					state.width,
					state.height,
					Math.floor(sprite.x),
					Math.floor(sprite.y),
					state.width,
					state.height
				);
				if(sprite.destination.x != -1) {
					paca.canvas.fillRect(sprite.destination.x-1, sprite.destination.y-1, 3, 3);
				}
			}
		}
		//draw the big version
		paca.resize();
	},
	resize: function(){
		var upscaledCanvas = document.getElementById('resized').getContext('2d');
		upscaledCanvas.mozImageSmoothingEnabled = false;
		upscaledCanvas.webkitImageSmoothingEnabled = false;
		upscaledCanvas.msImageSmoothingEnabled = false;
		upscaledCanvas.imageSmoothingEnabled = false;
		paca.camera.shakex = 5 * Math.sin(2 * Math.PI*(paca.time / 1000));
		paca.camera.shakey = 2 * Math.sin(2 * Math.PI*(paca.time / 700));
		var camx = paca.camera.x + paca.camera.shakex;
		var camy = paca.camera.y + paca.camera.shakey;
		if(camx < 0) {
			camx = 0;
		}
		if(camy < 0) {
			camy = 0;
		}
		upscaledCanvas.drawImage(paca.canvas.canvas, camx, camy, cartridge.settings.camwidth, cartridge.settings.camheight, 0, 0, paca.width, paca.height);

	}
};