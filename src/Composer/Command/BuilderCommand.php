<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;


use Composer\Command\BaseCommand;
use Composer\Composer;

/**
 * Class BuilderCommand
 *
 * @package Rocket\Composer\Command
 */
class BuilderCommand extends BaseCommand
{

    protected $pkg_path;

    /**
     * BuilderCommand constructor.
     *
     * @param null $name
     */
    public function __construct($name = null)
    {
        parent::__construct( $name );

        $this->pkg_path = getcwd() . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'metabolism'. DIRECTORY_SEPARATOR .'rocket-builder' . DIRECTORY_SEPARATOR;
    }

    /**
     * Start Rocket-Builder NPM dependencies installation
     */
    protected function installNodeModules()
    {
        if ( is_dir( $this->pkg_path ) )
        {
            $this->getIO()->write( '  Installing node modules...' );
            chdir( $this->pkg_path );

            //todo: check if yarn is installed else use npm
            if ( is_dir( 'node_modules' ) )
            {
                passthru( "yarn upgrade --production" );
            }
            else
            {
                passthru( "yarn install --production" );
            }
        }
    }
}