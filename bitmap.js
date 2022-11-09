




/*
     FILE ARCHIVED ON 3:58:09 Dec 6, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:51:22 Aug 21, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
// 8-bit Bitmap for use in HTML5 Canvas
// Copyright (c) 2010 Joseph Huckaby.
// Released under the LGPL v3.0: /web/20151206035809/http://www.opensource.org/licenses/lgpl-3.0.html

Class.create( 'Bitmap', {
	
	width: 0,
	height: 0,
	pixels: null,
	palette: null,
	drawCount: 0,
	optPixels: null,
	
	__construct: function(img) {
		// class constructor
		this.width = img.width;
		this.height = img.height;
		this.palette = new Palette( img.colors, img.cycles );
		this.pixels = img.pixels;
	},
	
	optimize: function() {
		// prepare bitmap for optimized rendering (only refresh pixels that changed)
		var optColors = [];
		for (var idx = 0; idx < 256; idx++) optColors[idx] = 0;
		
		// mark animated colors in palette
		var cycles = this.palette.cycles;
		for (var idx = 0, len = cycles.length; idx < len; idx++) {
			var cycle = cycles[idx];
			if (cycle.rate) {
				// cycle is animated
				for (idy = cycle.low; idy <= cycle.high; idy++) {
					optColors[idy] = 1;
				}
			}
		}
		this.optColors = optColors;
		
		// create array of pixel offsets which are animated
		var optPixels = this.optPixels = [];
		var pixels = this.pixels;
		var j = 0;
		var i = 0;
		var x, y;
		var xmax = this.width, ymax = this.height;
		
		for (y = 0; y < ymax; y++) {
			for (x = 0; x < xmax; x++) {
				if (optColors[pixels[j]]) optPixels[i++] = j;
				j++;
			} // x loop
		} // y loop
	},
	
	clear: function(imageData) {
		// clear all pixels to white
		var data = imageData.data;
		var i = 0;
		var x, y;
		var xmax = this.width, ymax = this.height;
		
		for (y = 0; y < ymax; y++) {
			for (x = 0; x < xmax; x++) {
				data[i + 0] = 255; // red
			    data[i + 1] = 255; // green
		        data[i + 2] = 255; // blue
		        data[i + 3] = 255; // alpha
				i += 4;
			}
		}
	},
	
	render: function(imageData, optimize) {
		// render pixels into canvas imageData object
		var colors = this.palette.getRawTransformedColors();
		var data = imageData.data;
		var pixels = this.pixels;
		
		if (optimize && this.drawCount && this.optPixels) {
			// only redraw pixels that are part of animated cycles
			var optPixels = this.optPixels;
			var i, j, clr;
			
			for (var idx = 0, len = optPixels.length; idx < len; idx++) {
				j = optPixels[idx];
				clr = colors[ pixels[j] ];
				i = j * 4;
				
				data[i + 0] = clr[0]; // red
			    data[i + 1] = clr[1]; // green
		        data[i + 2] = clr[2]; // blue
				// data[i] = (clr & 0xff0000) >> 16;
				// data[i+1] = (clr & 0x00ff00) >> 8;
				// data[i+2] = (clr & 0x0000ff);
				
		        // data[i + 3] = 255; // alpha
			}
		}
		else {
			// draw every single pixel
			var i = 0;
			var j = 0;
			var x, y, clr;
			var xmax = this.width, ymax = this.height;
			
			for (y = 0; y < ymax; y++) {
				for (x = 0; x < xmax; x++) {
					clr = colors[ pixels[j] ];
					
					data[i + 0] = clr[0]; // red
				    data[i + 1] = clr[1]; // green
			        data[i + 2] = clr[2]; // blue
					// data[i] = (clr & 0xff0000) >> 16;
					// data[i+1] = (clr & 0x00ff00) >> 8;
					// data[i+2] = (clr & 0x0000ff);
					
			        // data[i + 3] = 255; // alpha
					
					i += 4;
					j++;
				}
			}
		}
		
		this.drawCount++;
	}
	
} );
