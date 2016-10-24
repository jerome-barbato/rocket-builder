# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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
