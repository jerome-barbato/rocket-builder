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

    protected $pkg_paths;

    /**
     * BuilderCommand constructor.
     *
     * @param null $name
     */
    public function __construct($name = null)
    {
        parent::__construct( $name );

        $this->pkg_paths = [
	        'app' => getcwd() . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'FrontBundle'. DIRECTORY_SEPARATOR .'Resources' . DIRECTORY_SEPARATOR .'src' . DIRECTORY_SEPARATOR,
        	'builder' => getcwd() . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'metabolism'. DIRECTORY_SEPARATOR .'rocket-builder' . DIRECTORY_SEPARATOR
	    ];
    }

    /**
     * Start Rocket-Builder NPM dependencies installation
     */
    protected function installNodeModules()
    {
    	foreach ($this->pkg_paths as $name=>$path)
	    {
		    if ( is_dir( $path ) )
		    {
			    $this->getIO()->write( '<comment>Installing '.$name.' node modules...</comment>' );
			    chdir( $path );

			    if ( is_dir( 'node_modules' ) )
			    {
				    passthru( "yarn upgrade --production", $err);

				    if( $err )
					    passthru( "npm upgrade --production");
			    }
			    else
			    {
				    passthru( "yarn install --production", $err);

				    if( $err )
					    passthru( "npm install --production");
			    }
		    }
	    }
    }
}