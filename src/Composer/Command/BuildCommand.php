<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class BuildCommand extends BuilderCommand
{
    protected function configure()
    {
        $this->setName('build');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $args = $input->getArguments();

        if ( is_dir( $this->pkg_path ) ) {
            chdir( $this->pkg_path );
            $options = count( $args ) ? $args[0] : '';

            if ( !is_dir( 'node_modules' ) ) {
                $this->installNodeModules();
            }

            passthru( "gulp " . $options . " --color=always" );
        }
    }
}
