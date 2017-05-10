# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.4.2 - 2013-05-10
### Changed
- Angulight: delay controller init at one tick
- Custom: add refresh trigger

## 3.4.1 - 2013-04-25
### Added
- Slider auto height

## 3.4.0 - 2013-04-20
### Added
- Branch aliases for composer, instead of using `dev-dev` tag in composer, you can now use `3.4.x-dev`
### Changed
- Composer Commands
  - `composer create` and `composer build` are now added to this project and can be used anywhere if installing from composer.
  - Symlinks creation is also moved into this project from boilerplate.
- Hide-On behaviour
- Media queries ( mobile = phone, tablet = small, ... )

## 3.3.10 - 2017-04-20 ##
### Fixed
- Grid col attribute

## 3.3.9 - 2017-03-17 ##
### Fixed
- IE Fit bug
- no more autoplay while scrolling on slider
### Removed
- parallax on IE

## 3.3.8 - 2017-03-15 ##
### Fixed
- has scrolled removed on top
### Removed
- hide on mobile, use hide on phone

## 3.3.7 - 2017-03-15 ##
### Fixed
- Map marker hover error
### Changed
- map events

## 3.3.6 - 2017-03-10 ##
### Fixed
- animation on span
- check for $libraires variable existance globally
- more default variables
### Added
- $space variable, $grid-default-space use $space as default

## 3.3.5 - 2017-03-09 ##
### Fixed
- animations
- map object

## 3.3.4 - 2017-03-08 ##
### Fixed
- reveal animation

## 3.3.3 - 2017-03-07 ##
### Changed
- libs are now encapsulated in anonymous function with jQuery as parameter
### Fixed
- bugfix in scroll-to

## 3.3.2 - 2017-03-06 ##
### Added
- reveal animation
### Fixed
- custom select width
## 3.3.1 - 2017-03-02 ##
### Changed
- toogle now support list based component
### Updated
- no more has-fit-object on data-object_fit item
### Fixed
- li tag escape in the compiler

## 3.4.0 - IN-DEV ##
### Added
* Composer Plugin - [See documentation](composer.md)
    * composer build
    * composer create
    * File management is now placed under subpackage `composer.json`

## 3.3.0 - 2017-02-24 ##
### Added
- new bind library ( see doc/features/bin.md )
- responsive Grid
- most framework sass variable are now noted as !default
### Changed
- renamed UX to Meta
- renamed ux. to meta.
- Slider classname is now compatible with iSwiper
- global code simplification using data attribute
### Updated
- jQuery to 2.2.4
- jQuery.touchSwipe to 1.6.18
### Fixed
- minor bugfix for most library

## 3.2.13 - 2017-02-14 ##
### Fixed
- UX Defer now wait for window load ^^
### Added
- Map find nearest points + cluster optimisations

## 3.2.12 - 2017-02-09 ##
### Fixed
- Fix slider animation

## 3.2.11 - 2017-02-09 ##
### Fixed
- Fix slider issue

## 3.2.10 - 2017-02-01 ##
### Fixed
- Youtube embed url
### Added
- grid mixin
- multi template extension support

## 3.2.9 - 2017-01-26 ##
### Fixed
- on-demand.js loading issue
### Added
- sizer 16/10

## 3.2.8 - 2017-01-23 ##
### Fixed
- slider.js

## 3.2.7 - 2017-01-17 ##
### Changed
- simplified slider.js by replacing class with data- like data-animation
### Removed
- backface-visibility globally
- ._clearfix extends

## 3.2.6 - 2017-01-11 ##
### Added
- .yarnclean

## 3.2.5 - 2017-01-10 ##
### Fixed
- console.time error on IE
- loop on youtube embed, enablejsapi option
- remove on, migrated to angulight

## 3.2.4 - 2017-01-10 ##
### Added
* Custom library for select ( for the moment ) using jQuery ui selectmenu

    `<select custom>
      <option></option>
    </select>`
    
    `<select custom placeholder="Select item">
      <option></option>
    </select>`

## 3.2.3 - 2017-01-10 ##
### Added
* Tag library for google analytics

    `<a tag="xx|yy|zz"></a>` execute ga('send', 'event', 'xx', 'yy', 'zz');

API :  
- ux.tag.event('xx', 'yy', 'zz');
- ux.tag.page('/url');

## 3.2.2 - 2017-01-06 ##
### Fixed
* Defer : now use fit on change
* Slider : Wrong class added on slider when unique
### Added
* Detect scroll : added has-scrolled class

## 3.2.1 - 2017-01-02 ##
### Fixed
* Popin issue : cannot be opened more than once
* Slider initialisation when window is already loaded
* Grid on mobile reset
### Added
* Slider : stack animation

## 3.2.0 - 2016-12-30 ##
### Changed
* Major, popin and angulight now require template to be declared in <script type="text/template"> to solve SEO issues

## 3.1.9 - 2016-12-29 ##
### Fixed
* Wrong popin id usage

## 3.1.8 - 2016-12-28 ##
### Fixed
* Broken map clusters cleaning

## 3.1.7 - 2016-12-22 ##
### Fixed
* Defer not working

## 3.1.6 - 2016-12-19 ##
### Fixed
* Detect scroll : Wrong offset detection when using css transform

## 3.1.5 - 2016-12-19 ##
### Added
* Map now handle clusters

## 3.1.4 - 2016-12-19 ##
### Added
* Added AGPL-3 License
* Added authors to project

## 3.1.3 - 2016-12-18 ##
### Added
* draw hover animation

## 3.1.2 - 2016-12-18 ##
### Fixed
* Gulp Backward compatibility

## 3.1.1 - 2016-12-18 ##
### Updated
* popin.js - create a new instance of UXPopin each time
### Added
* window.sanitize utils fonction

## 3.1.0 - 2016-12-16 ##
### Updated
* builder.yml organization, script and template are separated
* See builder.yml.sample as reference
### Added
* style options in builder.yml to handle css browser prefix compatibility

## 3.0.4 - 2016-12-14 ##
### Fixed
* on demand resize function
### Updated
* jquery.touchSwipe.js to 1.6.18 and re-integrated in polyfill folder

## 3.0.5 - 2016-12-14 ##
### Fixed
* on demand resize function
### Updated
* jquery.touchSwipe.js to 1.6.18 and re-integrated in polyfill folder


## 3.0.4 - 2016-12-07 ##
### Updated
* UXSlider - ux-slider.updated is now triggered on the slider itself
### Added
* SCSS - transition library to allow data-transition-delay


## 3.0.3 - 2016-12-07 ##
* Public release


## 3.0.2 - 2016-11-18 ##
### Removed ###
* mod-- modernizr class prefix + reduced feature detection ( removed svg, canvas, video ...)
### Added ###
* Object position now supported 

      <img src="" object-fit="cover" object-position="bottom left">


## 3.0.1 - 2016-11-10 ##
### Added ###
* Compilation and minification of assets files to web folder.
### Fixed ###
* Clean is now del.sync to avoid compilation collision


## 3.0.0 - 2016-11-08 ##
### Updated ###
* Refracting folder names
* Composer.json
* Paths retrieval and configuration now using YAML syntax.
### Fixed ###
* Template compilation
* Slider autoplay
* DOM Compiler


## 2.3.2 - 2016-10-03 ##
### Fixed ###
* Old angular version compatibility

## 2.3.1 - 2016-10-03 ##
### Fixed ###
* Fit issue

## 2.3.0 - 2016-10-03 ##
### Changed ###
* scroll-to duration now configurable by link
* renamed all UI to UX, all ui- to ux- to remove jQuery UI compatibility issue
* remove ui-slider, now use slider directly
### Fixed ###
* Fixed dom compiler angular directive timeout issue
* Fixed onDemand angular loading issue
* Fixed Activation angular loading issue

## 2.2.9 - 2016-09-30 ##
### Added ###
* mq function for Modernizr
### Changed
* Framework auto-detection for path settings.

## 2.2.8  - 2016-10-03 ##
### Fixed ###
* Path: tmp path was wrong
* app.debug compiler errors
* Gulp prod compile now compress css and js without .min
### Added ###
* enter on popin and toggle handlers
* mq function for Modernizr
### Changed
* UISlider is now UXSlider, other lib will be changed too

## 2.2.7  - 2016-09-28 ##
### Fixed ###
* Animation library : remove data-animation on ended to allow transition

## 2.2.6  - 2016-09-26 ##
### Fixed ###
* Version prb

## 2.2.5  - 2016-09-26 ##
### Changed ###
* added srcset Modernizr detection
### Fixed ###
* Fit bug on IE
* Dom Compiler Angular compatibility ( still need work )
* Angular dom compilation for popin
### Added ###
* srcset polyfill for IE

## 2.2.4  - 2016-09-15 ##
### Added ###
* Added template compilation condition from app.front.config : "compile": true|false

## 2.2.3  - 2016-09-15 ##
### Changed ###
* Update node modules

## 2.2.2  - 2016-09-13 ##
### Added ###
* Linting task with Google Javascript standards ( usage of ESLint )

## 2.2.1  - 2016-09-16 ##
### Added ###
* Unit tests supports with Jasmine
  * JQuery initialize

## 2.2.0  - 2016-08-10 ##
### Added ###
* added create ( block and component ) task
* new dependency fs-path

## 2.1.0  - 2016-08-10 ##
### Added ###

* Arguments addition:
    * --production | -p : Enable assets compression
    * --no-watch        : Disable src assets watching
    * --framework 'name'      : Specific framework behavior ( rocket, silex, wordpress )
    * --theme 'name' : Specific theme behavior
* added protect html attribute to write inline twig ex :

        <input protect="{{ required ? 'required' }}">

### Changed ###

* Environment can now be set as environment variable.

## 2.0.0  - 2016-07-27 ##
### Changed ###
* removed from core module

## 1.5.0  - 2016-07-18 ##
### Changed ###

 * moved gulpfiles and package to core, added builder symlink
 
## 1.4.0  - 2016-06-24 ##
### Added ###
 * unity test
 * Rocket html compiler

### Changed ###
 * refractoring, partialing
 
## 1.3.0  - 2016-06-08 ##
### Added ###
 * added front.config parsing
 
## 1.2.0  - 2016-05-12 ##
### Added ###
* gulp-css-globbing to allow @import '*'

### Changed ###

 * changed gulp-ruby-sass to gulp-sass
