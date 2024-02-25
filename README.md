## Living Worlds - Wallpaper Engine Web Wallpaper

https://steamcommunity.com/sharedfiles/filedetails/?id=2119347960

---

This is a port of the 'Living Worlds' animated pixel art images, originally created by Mark Ferrari, to a Wallpaper Engine web wallpaper.

Specifically it is based on the HTML5 color cycling implementation by Joseph Huckaby, which can be found here: http://www.effectgames.com/demos/worlds/

You can learn more about the long history of this work of art here:
- https://web.archive.org/web/20160414062925/http://www.iangilman.com/software/seizetheday.php
- https://web.archive.org/web/20160419082955/http://www.effectgames.com/effect/article.psp.html/joe/Old_School_Color_Cycling_with_HTML5

---
### Development

All the Wallpaper Engine relevant code is in the `main.js` file. The properties are handled at the top, the rest is hacked into various places in the original code. 

The git repository was created after the initial implementation, so to get all the actual changes you would have to diff against the code from the effectgames website above.

The `build.bat` and `build_exclude.txt` are used to just copy only the required files to another folder, so that the actual Steam Workshop size is smaller.
