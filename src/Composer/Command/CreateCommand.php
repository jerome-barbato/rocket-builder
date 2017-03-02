<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;


use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateCommand extends BuildCommand
{
    protected function configure()
    {
        $this->setName('create');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $args = $input->getArguments();


        if ( is_dir( $this->pkg_path ) ) {
            chdir( $this->pkg_path );

            if ( !is_dir( 'node_modules' ) ) {
                $this->installNodeModules();
            }

            if ( count( $args ) > 1 ) {

                $type = $args[0];
                array_shift( $args );

                foreach ( $args as $arg ) {
                    passthru( "gulp create --" . $type . " " . $arg . "  --color=always" );
                }
            }
        }
    }
}
