<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;


use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateCommand extends BuildCommand
{
    protected function configure()
    {
        $this->setName('create');
        $this->addArgument('module', InputArgument::IS_ARRAY, "Modules");
        $this->setHelp(<<<EOT
Create UI modules.
EOT
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $args = $input->getArgument('module');

        if ( is_dir( $this->pkg_path ) ) {
            chdir( $this->pkg_path );

            if ( !is_dir( 'node_modules' ) ) {

                $output->writeln("<comment>Node modules installation...</comment>");
                $this->installNodeModules();
            }

            if ( count( $args ) > 1 ) {

                $type = $args[0];
                array_shift( $args );

                foreach ( $args as $arg ) {

                    $output->writeln("<comment>Creating " . $type . " " . $arg . "...</comment>");
                    passthru( "gulp create --" . $type . " " . $arg . "  --color=always" );
                }
            }
        }
    }
}
