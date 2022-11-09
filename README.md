These amazing images were created by Mark Ferrari(http://markferrari.com/) and the code was created by Joe Huckaby. All I did was scrape the code and images from The Wayback Machine.

You can learn more about the long history of this work of art here:

https://web.archive.org/web/20160414062925/http://www.iangilman.com/software/seizetheday.php

and here:

https://web.archive.org/web/20160419082955/http://www.effectgames.com/effect/article.psp.html/joe/Old_School_Color_Cycling_with_HTML5

How to use:

Download the code and open index.html in Chrome, Firefox, or any browser that supports HTML5. I find Firefox is the best to run it on.

How to use with Raspberry pi 3:

1) Set up your raspberry pi and 7 inch touch screen

2) Install raspbian(this comes with the pi as the "NOOBS OS" if you buy the bundle)

3) Install Firefox(Ice weasel)

Next turn off screen sleeping

4) Open the terminal and run: "sudo leafpad etc/lightdm/lightdm.conf"

5) Under the "[SetDefaults]" section, find "#xserver-command=X"

6) Remove the "#"

7) Change the setting to "xserver-command=X -s 0 -dpms"

8) Save and reboot

9) Transfer the code to the Raspberry Pi

10) Right click on index.html and run with Firefox

11) Turn Firefox into full screen mode and adjust the zoom so that the art fills the top and bottom of the screen.

12) Enjoy
