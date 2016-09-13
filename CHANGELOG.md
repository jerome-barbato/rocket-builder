# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.2.2  - 2016-09-13 ##
### Added ###
* Unit tests supports with Jasmine
  * JQuery initialize
  
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
