# Rocket Builder #

INTRODUCTION
------------

Rocket Builder is a Gulp module for Rocket framework compilation.

Rocket framework use a custom template language which helps developers and web-designers to be more efficient on Web Integration. Rocket builder can be used for compiling the semantic into readable files for every browser.

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
 
Fresh install
------------

    apt-get install nodejs
    apt-get install npm

    npm cache clean -f
    npm install -g n
    n stable
	
    apt-get install rubygems
    gem install sass
    npm install -g gulp

INSTALLATION
------------

####Download
* Option n°1 : NPM

In dependecies field from your package.json, please send us your ssh key.

        "dependencies": {
            "rocket-builder": "git+ssh://git@bitbucket.org:Metabolism/rocket-builder.git#master"
          }

* Option n°2 : Git 

        git clone git@bitbucket.org:Metabolism/rocket-builder.git builder
####Dependencies
Depending on what usage you will do of the builder, two options are availables :

* Minimum dependencies
  * Preprocessors CSS
  * Preprocessors HTML
  * Linting

        cd builder
        npm install --production

* Install full dependencies
  * Preprocessors CSS
  * Preprocessors HTML
  * Linting
  * Tests modules
  
        cd builder
        npm install
        
USAGE
------------

    cd builder
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
   
        
Tools
-----------

Some tools are available thought gulp

### Create ###

    gulp create --block my_block
    gulp create --block subfolder/my_block
    
    gulp create --component my_component
    gulp create --component subfolder/my_component
        
MAINTAINERS
-----------

This project is the full property of Metabolism Agency ( http://metabolism.fr )

Current maintainers:
 * Jérôme Barbato - jerome@metabolism.fr
 * Paul Coudeville - paul@metabolism.fr
