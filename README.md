Ponyville Live! Desktop App
=========

The Ponyville Live! Desktop app was designed for [Ponyville Live!] [1] by TheAuzzieBrony.

This fork is overhauled and maintained by [berwyn](https://github.com/berwyn).

The chrome application is designed to make it simpler and easier for users to tune into their favourite radio station on the Ponyville Live! network without having to open a new browser window and so on. Just open the app and select your station.

Version
----

v0.3.0_BETA

**If the current version ends with _BETA it means somethings may not work how they are expected to**

Change List
----

* **v0.3.0_BETA** - Introduces Material Angular, providing a better UI, as well as adding the basics to support video streams and Podcasts!
* **v0.2.0_BETA** - A total rewrite in Angular.js, allowing the app to be far more flexible
* **v0.1.10_BETA** - v0.2.0 Pre-Release | Fix to handle new update to the PVL public API | Total code re-write
* **v0.1.7** - Added facebook button to the app
* **v0.1.6** - Fixed miss-typed jQuery selectors which were effecting voting | Removed 'update_url' from the manifest designed for the chrome store
* **v0.1.5** - Fixed notifications to make sure they get cleared after 5 seconds | Cleaned up the jQuery code | moved the player controls to the bottom of the display | Added auto update to allow update pulls from the github repo
* **v0.1.4** - Added code to refresh vote buttons on song change to remove 'selected'
* **v0.1.3** - Toned down the 'full on' kind of style that offline stations had | Turned the font size of station titles down on the display due to cliping
* **v0.1.2** - Fixed bug where notifications would continue even after playback had been stopped
* **v0.1.1** - Removed the stupid .0/.1 release version rule | Removed un-needed minor version value | Removed custom title bar and changed to native system style | Added branding to the start display
* **v0.0.1.0_RELEASE** - Initial Release Version
* **v0.0.3_DEV_BETA** - Added pause button to display | Changed update code to still update display even if no station is set to playing | Changed version in the manifest, versions ending with .1 are BETA versions and those with .0 are release versions | Fixed bug where the right side of the exit button wouldn't work
* **v0.0.2_DEV_BETA** - Updated Selected Station Display Information | Added voting thumbs and score | Added handling for offline stations 
* **v0.0.1_DEV_BETA** - Initial Git DEV-BETA Channel Release

Installation
--------------
To install from the source code, you'll need Node.js, npm, Gulp, and Bower.
With these installed and the repo cloned, you can
```bash
cd $CODE_DIR && npm install && bower install && gulp build
```

The compiled extension is in the "compiled" directory, and can be directly
loaded from the [Chrome extensions page](chrome://extensions).

License
----

Copyright (c) Liam 'Auzzie' Haworth <production@hiveradio.net>, 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]:https://ponyvillelive.com

