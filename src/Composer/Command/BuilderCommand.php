<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;


use Composer\Command\BaseCommand;
use Composer\Composer;

class BuilderCommand extends BaseCommand
{

    protected $pkg_path;

    public function __construct($name = null) { parent::__construct( $name );
        $this->pkg_path = getcwd() . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'metabolism'. DIRECTORY_SEPARATOR .'rocket-builder' . DIRECTORY_SEPARATOR;
    }

    /**
     * Start Rocket-Builder NPM dependencies installation
     */
    protected function installNodeModules()
    {
        if ( is_dir( $this->pkg_path ) ) {
            $this->getIO()->write( '  Installing node modules...' );
            chdir( $this->pkg_path );

            if ( is_dir( 'node_modules' ) ) {
                passthru( "yarn upgrade --production" );
            }
            else {
                passthru( "yarn install --production" );
            }
        }
    }
}