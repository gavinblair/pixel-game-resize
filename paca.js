var paca = {
	time: 0,
	canvas: {},
	cursor: {
		x: -1,
		y: -1,
		active: false
	},
	height: 0,
	width: 0,
	camera: {
		x: 0,
		y: 0,
		shakex: 0,
		shakey: 0,
		width: 0,
		height: 0
	},
	refreshviewport: function(){
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);

		paca.height = $(window).height();
		paca.width = $(window).width();

		$('#resized').attr('height', paca.height);
		$('#resized').attr('width', paca.width);

		var ratio = paca.width / paca.height;
		paca.camera.height = cartridge.settings.camheight;
		paca.camera.width = cartridge.settings.camheight * ratio;
		paca.camera.width*=cartridge.settings.zoom;
		paca.camera.height*=cartridge.settings.zoom;
	},
	init: function(){

		//first things first, let's preload all the images
		var preload = {
			scenes: [],
			sprites: []
		}
		for(var i in cartridge.scenes) {
			preload['scenes'][i] = new Image();
			preload['scenes'][i].src = cartridge.scenes[i].image;
		}
		for(var i in cartridge.sprites) {
			for(var j in cartridge.sprites[i].states) {
				preload['sprites'][i+' '+j] = [];
				preload['sprites'][i+' '+j]['image'] = new Image();
				preload['sprites'][i+' '+j]['image'].src = cartridge.sprites[i].states[j].image;
				preload['sprites'][i+' '+j]['reverse'] = new Image();
				preload['sprites'][i+' '+j]['reverse'].src = cartridge.sprites[i].states[j].reverse;
			}
		}

		//disable scrolling
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', function(e){e.preventDefault(); return false;}, false);
		}

		//fastclick
		FastClick.attach(document.body);

		//disable bouncy scrolling in safari on ios
		$(document).bind(
			'touchmove',
				function(e) {
					e.preventDefault();
				}
		);

		window.onmousewheel = document.onmousewheel = function(e){e.preventDefault(); return false;};
		window.onscroll = function(e){e.preventDefault(); return false;};

		paca.canvas = document.getElementById("game").getContext('2d');
		paca.canvas.mozImageSmoothingEnabled = false;
		paca.canvas.msImageSmoothingEnabled = false;
		paca.canvas.imageSmoothingEnabled = false;

		$('#game').attr('height', cartridge.settings.sourceheight);
		$('#game').attr('width', cartridge.settings.sourcewidth);

		paca.refreshviewport();
		$(window).on("orientationchange resize", function(){
			paca.refreshviewport();
		});

		paca.loop();
		cartridge.scenes[cartridge.currentscene].init();

		$('#resized').mouseup(function(e){
			paca.cursor.active = false;
		});

		$('#resized').click(function(e){
			paca.cursor.active = true;
			//convert e.clientX
			var heightratio = $('#resized').height() / paca.camera.height;
			//convert e.clientY
			var widthratio = $('#resized').width() / paca.camera.width;

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
		$('#resized').on('touchmove mousemove', function(e){
			//convert e.clientX
			var heightratio = $('#resized').height() / cartridge.settings.camheight;
			//convert e.clientY
			var widthratio = $('#resized').width() / cartridge.settings.camwidth;

			paca.cursor.x = Math.floor(e.clientX / widthratio + paca.camera.x);
			paca.cursor.y = Math.floor(e.clientY / heightratio + paca.camera.y);
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
							paca.cursor.active = false;
						}
					}
					//camera
					//sprite.camoffsetx should be either heading towards state.visiblewidth or 0
					if(sprite.camoffsetx < state.visiblewidth && sprite.direction == 'left') {
						sprite.camoffsetx++;
					}
					if(sprite.camoffsetx > 0 && sprite.direction == 'right') {
						sprite.camoffsetx--;
					}
					paca.camera.x = (sprite.x - sprite.camoffsetx) - paca.camera.width / 4;
					paca.camera.y = (sprite.y) - paca.camera.height / 4;
					if (paca.camera.x < 0) {
						paca.camera.x = 0;
					}
					if (paca.camera.x > cartridge.settings.sourcewidth - paca.camera.width) {
						paca.camera.x = cartridge.settings.sourcewidth - paca.camera.width;
					}
					if (paca.camera.y < 0) {
						paca.camera.y = 0;
					}
					if (paca.camera.y > cartridge.settings.sourceheight - paca.camera.height) {
						paca.camera.y = cartridge.settings.sourceheight - paca.camera.height;
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
			}
		}
		//draw the cursor
		if(paca.cursor.x != -1) {
			var size = 6;
			if(paca.cursor.active) {
				size = 4;
			}
			paca.canvas.fillStyle = "black";
			paca.canvas.fillRect(Math.floor(paca.cursor.x-size/2), Math.floor(paca.cursor.y-size/2), size, size);
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
		upscaledCanvas.drawImage(paca.canvas.canvas, camx, camy, paca.camera.width, paca.camera.height, 0, 0, paca.width, paca.height);

	}
};