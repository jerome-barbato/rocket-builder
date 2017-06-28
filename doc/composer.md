# Composer

Composer is a main part of our stack, many scripts are added to composer. This document describe their usage.
[Install Composer](https://getcomposer.org/ )
 

## Project build

This commands is a shortcut to compile project assets using Rocket Builder module.

Rocket framework use a custom template language which helps developers and web-designers to be more efficient on Web Integration. Rocket builder can be used for compiling the semantic into readable files for every browser.

Rocket builder can compile tree type of file :

TWIG with metabolism custom semantic
SASS
Javascript

>More informations are available in `vendor/metabolism/rocket-builder/readme.md` file.

 Simple compilation, with raw assets.
 
    composer build
    
 Production compilation, with minimized assets. 
 
 >This option is recommended to optimize page loading.
    
    composer build -p

## Assets components generation

Rocket builder offers a possibility to automatically create TWIG and SCSS assets.
Theses modules are created according to BEM organizational naming.
    
This command will generate `.twig` and `.scss` files that will be placed in `src/FrontBundle/Resources/private/shared` folder.

**Commands**    
    
Simple modules :

    composer create <module_name>
    
Page specific modules ( with subfolder creation )
    
    composer create <subfolder>/<module_name>
    
Multiple modules creation
    
    composer create <module_name_2> <module_name_2>

**Examples**

    composer create slider
    composer create burger menu
