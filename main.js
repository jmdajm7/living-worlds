/*
     FILE ARCHIVED ON 8:58:14 May 30, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:51:22 Aug 21, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
// Color Cycling in HTML5 Canvas
// BlendShift Technology conceived, designed and coded by Joseph Huckaby
// Copyright (c) 2001-2002, 2010 Joseph Huckaby.
// Released under the LGPL v3.0: /web/20160530085814/http://www.opensource.org/licenses/lgpl-3.0.html

FrameCount.visible = false;
var fpsInterval, now, then, elapsed;
var intervalID, selectedTime, selectedScene, randomEnabled, randomDelay;

window.wallpaperPropertyListener = {
	applyUserProperties: function (properties) {
		// SPEED
		if (properties.speed) {
			console.log("speed: " + properties.speed.value);
			
			CC.setSpeed(properties.speed.value);
		}
		
		// FPS
		if (properties.fps) {
			console.log("fps: " + properties.fps.value);
			
			CC.settings.targetFPS = properties.fps.value;
		}
		
		// BLENDSHIFT
		if (properties.blend_shift) {
			console.log("blend_shift: " + properties.blend_shift.value);
			
			if (properties.blend_shift.value) {
				CC.blendShift = true;
			}
			else {
				CC.blendShift = false;
			}
		}

		// STRETCH
		if (properties.stretch) {
			console.log("stretch: " + properties.stretch.value);

			CC.stretch = properties.stretch.value;
			CC.handleResize();
		}
		
		// SOUND
		if (properties.audio_enabled) {
			console.log("audio_enabled: " + properties.audio_enabled.value);
			
			if (properties.audio_enabled.value) {
				CC.audioEnabled = true;
				CC.stopSceneAudio();
				CC.startSceneAudio();
			}
			else {
				CC.audioEnabled = false;
				CC.stopSceneAudio();
			}
		}
		
		// VOLUME
		if (properties.audio_volume) {
			console.log("audio_volume: " + properties.audio_volume.value);
			
			CC.audioVolume = properties.audio_volume.value;
			CC.stopSceneAudio();
			CC.startSceneAudio();
		}
		
		// FIXED TIME
		if (properties.time){
			console.log("time: " + properties.time.value);
			
			CC.timeOffset = properties.time.value * 3600;
			selectedTime = properties.time.value;
		}
		
		// TIME	
		if (properties.sync_time) {
			console.log("sync_time: " + properties.sync_time.value);
			
			if (properties.sync_time.value){
				CC.syncTime = true;
				
				// set to current time
				var now = new Date();
				CC.timeOffset = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
			}
			else {
				CC.syncTime = false;
				
				// set to selected time
				CC.timeOffset = selectedTime * 3600;
			}
		}
		
		// TIME MULT
		if (properties.time_mult){
			console.log("time_mult: " + properties.time_mult.value);
			
			CC.timeMult = properties.time_mult.value;
		}
		
		///////////
		// MODES //
		///////////
		
		// SCENE
		if (properties.sceneselect) {
			console.log("sceneselect: " + properties.sceneselect.value);
			
			CC.switchScene(properties.sceneselect.value);
			selectedScene = properties.sceneselect.value;
		}
		
		// RANDOM
		if (properties.random_mode) {
			console.log("random_mode: " + properties.random_mode.value);
			
			clearInterval(intervalID);
		
			if (properties.random_mode.value) {
				randomEnabled = true;
				CC.switchScene(Math.floor(Math.random() * 22));
				intervalID = setInterval(function() { CC.switchScene(Math.floor(Math.random() * 22)); }, randomDelay * 1000 * 60)
			}
			else
			{
				randomEnabled = false;
				// switch back to selected scene
				console.log("switch back to " + selectedScene);
				CC.switchScene(selectedScene);
			}
		}
		
		// RANDOM DELAY
		if (properties.random_delay) {
			console.log("random_delay: " + properties.random_delay.value);
			
			randomDelay = properties.random_delay.value;
			if (randomEnabled) {
				clearInterval(intervalID);
				intervalID = setInterval(function(){ CC.switchScene(Math.floor(Math.random() * 22)); }, randomDelay * 1000 * 60)
			}
		}
		
		// CALENDAR
		if (properties.calendar_mode){
			console.log("calendar_mode: " + properties.calendar_mode.value);
			
			if (properties.calendar_mode.value) {
				CC.switchScene(CC.findSceneByMonth());
				
				// make sure random is actually disabled
				clearInterval(intervalID);
				randomEnabled = false;
			}
			else if (randomEnabled) {
				// switch to random scene on startup
				CC.switchScene(Math.floor(Math.random() * 21));
			}
			else {
				// switch back to selected scene
				CC.switchScene(selectedScene);
			}
		}
	}
}

var CanvasCycle = {
	
	cookie: new CookieTree(),
	ctx: null,
	imageData: null,
	clock: 0,
	inGame: false,
	bmp: null,
	globalTimeStart: (new Date()).getTime(),
	inited: false,
	optTween: null,
	winSize: null,
	globalBrightness: 1.0,
	lastBrightness: 0,
	sceneIdx: -1,
	highlightColor: -1,
	defaultMaxVolume: 0.5,
	
	syncTime: true,
	timeMult: 1,
	blendShift: true,
	audioEnabled: false,
	audioVolume: 1.0,
	audioTrack: null,

	OPT_WIDTH: 150,
	OPT_MARGIN: 15,
	
	settings: {
		targetFPS: 60,
		frameDelay: Math.floor(1000/this.targetFPS),
		speedAdjust: 1.0
	},

	contentSize: {
		width: 640,
		optionsWidth: 0,
		height: 480 + 40
	},

	init: function() {
		// called when DOM is ready
		if (!this.inited) {
			then = Date.now();
			
			this.inited = true;
			$('container').style.display = 'block';
		
			FrameCount.init();
		
			// pick starting scene

			var initialSceneIdx = 0;
			// var initialSceneIdx = Math.floor( Math.random() * scenes.length );
			//var initialSceneIdx = 0;
			
			
			// read prefs from cookie
			var prefs = this.cookie.get('settings');
			if (!prefs) prefs = {
				targetFPS: 60
			};
			
			// allow query to override prefs
			for (var key in this.query) {
				prefs[key] = this.query[key];
			}
			
			if (prefs) {
				this.setRate( prefs.targetFPS );
			}
			
			// start synced to local time
			var now = new Date();
			this.timeOffset = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
			this.updateTimelineDisplay();
			
			// load initial scene
			this.sceneIdx = initialSceneIdx;
			this.loadScene( initialSceneIdx );
		}
	},
	
	updateTimelineDisplay: function() {
		// also update the clocky
		var ampm = 'AM';
		var hour = Math.floor(this.timeOffset / 3600);
		if (hour >= 12) {
			ampm = 'PM';
			if (hour > 12) hour -= 12;
		}
		else if (hour == 0) hour = 12;
		if (hour < 10) hour = '0' + hour;
		
		var minute = Math.floor( (this.timeOffset / 60) % 60 );
		if (minute < 10) minute = '0' + minute;
		
		var second = Math.floor( this.timeOffset % 60 );
		if (second < 10) second = '0' + second;
	},

	switchScene: function(newSceneIdx) {
		console.log("switchScene: " + newSceneIdx);
		// switch to new scene (grab menu selection)
		this.sceneIdx = newSceneIdx;
		
		TweenManager.removeAll({ category: 'scenefade' });
		TweenManager.tween({
			target: { value: this.globalBrightness, newSceneIdx: this.sceneIdx },
			duration: Math.floor( this.settings.targetFPS / 2 ),
			mode: 'EaseInOut',
			algo: 'Quadratic',
			props: { value: 0.0 },
			onTweenUpdate: function(tween) {
				CanvasCycle.globalBrightness = tween.target.value;
			},
			onTweenComplete: function(tween) {
				CanvasCycle.loadScene( tween.target.newSceneIdx );
			},
			category: 'scenefade'
		});
	},

	findSceneByMonth: function() {
		var monthIdx = (new Date()).getMonth();
		for (var idx = 0, len = scenes.length; idx < len; idx++) {
			var scene = scenes[idx];
			if (scene.monthIdx == monthIdx) {
				return idx;
			}
		}
		return 0;
	},

	loadScene: function(idx) {
		// load image JSON from local .js files
		this.stop();
		this.showLoading();
		
		var scene = scenes[idx];
		
		switch(scene.name)
		{
			case "V26janclr":
			var objScene = V26janclrx;
			break;
			
			case "V26SNOWjansnow":
			var objScene = V26SNOWjansnowx;
			break;
			
			case "V19febclr":
			var objScene = V19febclrx;
			break;
			
			case "V19febcldy":
			var objScene = V19febcldyx;
			break;
			
			case "V30aprclr":
			var objScene = V30aprclrx;
			break;
			
			case "V30RAINaprrain":
			var objScene = V30RAINaprrainx;
			break;
			
			case "VW3BASIC":
			var objScene = VW3BASIC;
			break;
			
			case "V08mayclr":
			var objScene = V08mayclrx;
			break;
			
			case "V08maycldy":
			var objScene = V08maycldyx;
			break;
			
			case "V08RAINmayrain":
			var objScene = V08RAINmayrainx;
			break;
			
			case "V20JOEjunday":
			var objScene = V20JOEjundayx;
			break;
			
			case "V25julyclr":
			var objScene = V25julyclrx;
			break;
			
			case "V25julycldy":
			var objScene = V25julycldyx;
			break;
			
			case "CORAL":
			var objScene = CORALx;
			break;
			
			case "V29septclr":
			var objScene = V29septclrx;
			break;
			
			case "V29septcldy":
			var objScene = V29septcldyx;
			break;
			
			case "V05AMoctbegclr":
			var objScene = V05AMoctbegclrx;
			break;
			
			case "V05octendclr":
			var objScene = V05octendclrx;
			break;
			
			case "V05RAINoctrain":
			var objScene = V05RAINoctrainx;
			break;
			
			case "V16novclr":
			var objScene = V16novclrx;
			break;
			
			case "V16RAINnovrain":
			var objScene = V16RAINnovrainx;
			break;
			
			case "V12BASICdecclr":
			var objScene = V12BASICdecclrx;
			break;
			
		}
		
		
		this.initScene(objScene);
		
		/*
		var url = 'scene.php?file='+scene.name+'&month='+scene.month+'&script='+scene.scpt+'&callback=CanvasCycle.initScene';
		var scr = document.createElement('SCRIPT');
		scr.type = 'text/javascript';
		scr.src = url;
		document.getElementsByTagName('HEAD')[0].appendChild(scr);
		*/
	},
	
	showLoading: function() {
		// show spinning loading indicator
		var loading = $('d_loading');
		var kicker = 0;
		loading.style.left = '' + Math.floor( kicker + (((this.contentSize.width) / 2) - 16) ) + 'px';
		loading.style.top = '' + Math.floor( ((this.contentSize.height) / 2) - 16 ) + 'px';
		loading.show();
	},
	
	hideLoading: function() {
		// hide spinning loading indicator
		$('d_loading').hide();
	},

	initScene: function(scene) {
		// initialize, receive image data from server
		this.initPalettes( scene.palettes );
		this.initTimeline( scene.timeline );
		
		// force a full palette and pixel refresh for first frame
		this.oldTimeOffset = -1;
		
		// create an intermediate palette that will hold the time-of-day colors
		this.todPalette = new Palette( scene.base.colors, scene.base.cycles );
		
		// process base scene image
		this.bmp = new Bitmap(scene.base);
		this.bmp.optimize();
		
		var canvas = $('mycanvas');
		if (!canvas.getContext) return; // no canvas support
		
		if (!this.ctx) this.ctx = canvas.getContext('2d');
		this.ctx.clearRect(0, 0, this.bmp.width, this.bmp.height);
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect (0, 0, this.bmp.width, this.bmp.height);
		
		if (!this.imageData) {
			if (this.ctx.createImageData) {
				this.imageData = this.ctx.createImageData( this.bmp.width, this.bmp.height );
			}
			else if (this.ctx.getImageData) {
				this.imageData = this.ctx.getImageData( 0, 0, this.bmp.width, this.bmp.height );
			}
			else return; // no canvas data support
		}
		this.bmp.clear( this.imageData );
		

		this.globalBrightness = 0.0;
		TweenManager.removeAll({ category: 'scenefade' });
		TweenManager.tween({
			target: { value: 0 },
			duration: Math.floor( this.settings.targetFPS / 2 ),
			mode: 'EaseInOut',
			algo: 'Quadratic',
			props: { value: 1.0 },
			onTweenUpdate: function(tween) {
				CanvasCycle.globalBrightness = tween.target.value;
			},
			category: 'scenefade'
		});
		
		this.hideLoading();
		this.run();
		
		if (this.audioEnabled) {
			this.stopSceneAudio();
			this.startSceneAudio();
		}
	},
	
	initPalettes: function(pals) {
		// create palette objects for each raw time-based palette
		var scene = scenes[this.sceneIdx];
		
		this.palettes = {};
		for (var key in pals) {
			var pal = pals[key];
			
			if (scene.remap) {
				for (var idx in scene.remap) {
					pal.colors[idx][0] = scene.remap[idx][0];
					pal.colors[idx][1] = scene.remap[idx][1];
					pal.colors[idx][2] = scene.remap[idx][2];
				}
			}
			
			var palette = this.palettes[key] = new Palette( pal.colors, pal.cycles );
			palette.copyColors( palette.baseColors, palette.colors );
		}
	},
	
	initTimeline: function(entries) {
		// create timeline with pointers to each palette
		this.timeline = {};
		for (var offset in entries) {
			var palette = this.palettes[ entries[offset] ];
			if (!palette) return alert("ERROR: Could not locate palette for timeline entry: " + entries[offset]);
			this.timeline[offset] = palette;
		}
	},
	
	run: function () {
		// start main loop
		if (!this.inGame) {
			this.inGame = true;
			this.animate();
		}
	},
	
	stop: function() {
		// stop main loop
		this.inGame = false;
	},

	animate: function() {
		// limit fps
		fpsInterval = 1000 / this.settings.targetFPS;
		now = Date.now();
		elapsed = now - then;
		requestAnimationFrame( function() { CanvasCycle.animate(); });
		
		if (elapsed > fpsInterval) {
			then = now - (elapsed % fpsInterval);
			
			// animate one frame. and schedule next
			if (this.inGame) {
				var colors = this.bmp.palette.colors;
			
					//if (this.clock % this.settings.targetFPS == 0) $('d_debug').innerHTML = 'FPS: ' + FrameCount.current;
					//$('d_debug').innerHTML = 'FPS: ' + FrameCount.current + ((this.highlightColor != -1) ? (' - Color #' + this.highlightColor) : '');
				
				var optimize = true;
				var newSec = FrameCount.count();
				
				// only advance time if enabled
				if (newSec && this.syncTime) {
					// advance time
					this.timeOffset = this.timeOffset + this.timeMult;
					if (this.timeOffset >= 86400) this.timeOffset = 0;
					this.updateTimelineDisplay();
				}
				
				if (this.timeOffset != this.oldTimeOffset) {
					// calculate time-of-day base colors
					this.setTimeOfDayPalette();
					optimize = false;
				}
				if (this.lastBrightness != this.globalBrightness) optimize = false;
				if (this.highlightColor != this.lastHighlightColor) optimize = false;
				
				// cycle palette
				this.bmp.palette.cycle( this.bmp.palette.baseColors, GetTickCount(), this.settings.speedAdjust, this.blendShift);
				
				if (this.highlightColor > -1) {
					this.bmp.palette.colors[ this.highlightColor ] = new Color(0, 0, 0);
				}
				if (this.globalBrightness < 1.0) {
					// bmp.palette.fadeToColor( pureBlack, 1.0 - globalBrightness, 1.0 );
					this.bmp.palette.burnOut( 1.0 - this.globalBrightness, 1.0 );
				}
				
				// render pixels
				this.bmp.render( this.imageData, optimize );
				this.ctx.putImageData( this.imageData, 0, 0 );
				
				this.lastBrightness = this.globalBrightness;
				this.lastHighlightColor = this.highlightColor;
				this.oldTimeOffset = this.timeOffset;
				
				TweenManager.logic( this.clock );
				this.clock++;
				
				//if (this.inGame) requestAnimationFrame( function() { CanvasCycle.animate(); } );
			}
		}
	},
	
	setTimeOfDayPalette: function() {
		// fade palette to proper time-of-day
		
		// locate nearest timeline palette before, and after current time
		// auto-wrap to find nearest out-of-bounds events (i.e. tomorrow and yesterday)
		var before = {
			palette: null,
			dist: 86400,
			offset: 0
		};
		for (var offset in this.timeline) {
			if ((offset <= this.timeOffset) && ((this.timeOffset - offset) < before.dist)) {
				before.dist = this.timeOffset - offset;
				before.palette = this.timeline[offset];
				before.offset = offset;
			}
		}
		if (!before.palette) {
			// no palette found, so wrap around and grab one with highest offset
			var temp = 0;
			for (var offset in this.timeline) {
				if (offset > temp) temp = offset;
			}
			before.palette = this.timeline[temp];
			before.offset = temp - 86400; // adjust timestamp for day before
		}
		
		var after = {
			palette: null,
			dist: 86400,
			offset: 0
		};
		for (var offset in this.timeline) {
			if ((offset >= this.timeOffset) && ((offset - this.timeOffset) < after.dist)) {
				after.dist = offset - this.timeOffset;
				after.palette = this.timeline[offset];
				after.offset = offset;
			}
		}
		if (!after.palette) {
			// no palette found, so wrap around and grab one with lowest offset
			var temp = 86400;
			for (var offset in this.timeline) {
				if (offset < temp) temp = offset;
			}
			after.palette = this.timeline[temp];
			after.offset = temp + 86400; // adjust timestamp for day after
		}
		
		// copy the 'before' palette colors into our intermediate palette
		this.todPalette.copyColors( before.palette.baseColors, this.todPalette.colors );
		
		// now, fade to the 'after' palette, but calculate the correct 'tween' time
		this.todPalette.fade( after.palette, this.timeOffset - before.offset, after.offset - before.offset );
		
		// finally, copy the final colors back to the bitmap palette for cycling and rendering
		this.bmp.palette.importColors( this.todPalette.colors );
	},


	handleResize: function () {
		// custom scale logic
		var canvas = document.getElementById('mycanvas');
		var ratio = 640 / 480;
		var width = window.innerWidth;
		var height = window.innerHeight;

		if (this.stretch === 'horizontal') {
			// set the width of the canvas to match the height (multiplied by the ratio)
			canvas.style.height = width / ratio + 'px';
			canvas.style.width = width + 'px';
		}
		else if (this.stretch === 'vertical') {
			// set the height of the canvas to match the width (divided by the ratio)
			canvas.style.width = height * ratio + 'px';
			canvas.style.height = height + 'px';
		}
		else if (this.stretch === 'fill') {
			// et the canvas to the window size
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
		}
		else {
			// default resolution
			canvas.style.width = '640px';
			canvas.style.height = '480px';
		}
	},

	saveSettings: function() {
		// save settings in cookie
		this.cookie.set( 'settings', this.settings );
		this.cookie.save();
	},
	
	startSceneAudio: function() {
		// start audio for current scene, if applicable
		var scene = scenes[ this.sceneIdx ];
		if (scene.sound && this.audioEnabled && window.Audio) {
			if (this.audioTrack) {
				try { this.audioTrack.pause(); this.audioTrack.muted = true; } catch(e) {;}
			}
			TweenManager.removeAll({ category: 'audio' });
			
			//var ext = (ua.ff || ua.op) ? 'ogg' : 'mp3';
			var ext = 'mp3';
			var track = this.audioTrack = new Audio( 'audio/' + scene.sound + '.' + ext );
			track.volume = 0;
			track.loop = true;
			track.autobuffer = false;
			track.autoplay = true;
			
			track.addEventListener('canplaythrough', function() {
				track.play();
				TweenManager.tween({
					target: track,
					duration: Math.floor( CanvasCycle.settings.targetFPS * 2 ),
					mode: 'EaseOut',
					algo: 'Linear',
					props: { volume: scene.maxVolume * CC.audioVolume || CanvasCycle.defaultMaxVolume * CC.audioVolume },
					category: 'audio'
				});
				CanvasCycle.hideLoading();
				CanvasCycle.run();
			}, false);
			
			track.load();
		} // sound enabled and supported
		else {
			// no sound for whatever reason, so just start main loop
			this.hideLoading();
			this.run();
		}
	},
	
	stopSceneAudio: function() {
		// fade out and stop audio for current scene
		var scene = scenes[ this.sceneIdx ];
		if (scene.sound && window.Audio && this.audioTrack) {
			var track = this.audioTrack;
			
			if (ua.iphone || ua.ipad) {
				// no transition here, so just stop sound
				track.pause();
			}
			else {
				TweenManager.removeAll({ category: 'audio' });
				TweenManager.tween({
					target: track,
					duration: Math.floor( CanvasCycle.settings.targetFPS / 2 ),
					mode: 'EaseOut',
					algo: 'Linear',
					props: { volume: 0 },
					onTweenComplete: function(tween) {
						// ff has weird delay with volume fades, so allow sound to continue
						// will be stopped when next one starts
						track.pause();
					},
					category: 'audio'
				});
			}
		}
	},
	
	setRate: function(rate) {
		/* $('btn_rate_30').setClass('selected', rate == 30);
		$('btn_rate_60').setClass('selected', rate == 60);
		$('btn_rate_90').setClass('selected', rate == 90); */
		this.settings.targetFPS = rate;
		this.settings.animateTimeOut = Math.floor(1000/rate);
		this.saveSettings();
	},

	setSpeed: function(speed) {
		this.settings.speedAdjust = speed;
		this.saveSettings();
	}
};


var CC = CanvasCycle; // shortcut

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
																 || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, this.settings.frameDelay - (currTime - lastTime));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
						timeToCall);
					lastTime = currTime + timeToCall;
					return id;
			};

	if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
			};
}());
