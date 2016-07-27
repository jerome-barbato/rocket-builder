# Rocket Builder #
INTRODUCTION
------------

Rocket Builder is a Gulp module for Rocket framework compilation.

Rocket framework use a custom template language which helps developpers and webdesigners to be more efficient on Web Integration. Rocket builder can be used for compiling the semantic into readable files for every browser.

Rocket builder can compile tree type of file : 
 * TWIG with metabolism custom semantic
 * SASS
 * Javascript
 
REQUIREMENTS
------------

This module requires the following modules:

 * Gulp (http://gulpjs.com)
 * Sass (http://sass-lang.com)
 * NodeJS (https://nodejs.org)
 
RECOMMENDED MODULES
-------------------

* Composer : You can easily download Rocket builder from composer.

INSTALLATION
------------

* Option n°1 : Composer

In repository field from your package.json

        "repositories": [
            {
              "type": "vcs",
              "url": "git@bitbucket.org:Metabolism/rocket-builder.git"
            },
            ...
        ],
        "require-dev": {
            "metabolism/rocket-builder": "dev-master"
        }

* Option n°2 : Bitbucket 

        git clone git@bitbucket.org:Metabolism/rocket-builder.git
        cd rocket-builder
        npm install
        
USAGE
------------

    cd rocket-builder
    gulp
    
And it's done !

For your comfort, some arguments are available : 

    -p, --production
        Enable compression
    --no-watch
        Disable wathching on source assets
    --framework "rocket" | "silex" | "wordpress"
        Add specific behavior for a framework
    --theme "meta"
        Add specific behavior for theme
   
        
MAINTAINERS
-----------

This project is the full property of Metabolism Agency ( http://metabolism.fr )

Current maintainers:
 * Jérôme Barbato - jerome@metabolism.fr
 * Paul Coudeville - paul@metabolism.fr 
 
CHANGELOG
-----------
## 2.1 ##
* Environment can now be set as environment variable.

Arguments addition:
* --production | -p : Enable assets compression
* --no-watch        : Disable src assets watching
* --framework 'name'      : Specific framework behavior ( rocket, silex, wordpress )
* --theme 'name' : Specific theme behavior
## 2.0 ##
* removed from core module
## 1.5 ##
 * moved gulpfiles and package to core, added builder symlink
## 1.4 ##
 * refractoring, partialing, unity test addition, Rocket html compiler
## 1.3 ##
 * added front.config parsing
## 1.2 ##
 * changed gulp-ruby-sass to gulp-sass
 * added gulp-css-globbing to allow @import '*'