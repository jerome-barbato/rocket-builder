<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;


use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class CreateCommand
 *
 * @package Rocket\Composer\Command
 */
class CreateCommand extends BuilderCommand
{
    /**
     * Command declaration
     */
    protected function configure()
    {
        $this->setName('create');
        $this->addArgument('module', InputArgument::IS_ARRAY, "Modules");
        $this->setHelp(<<<EOT
Create UI modules.
EOT
        );
    }

    /**
     * Command execution
     *
     * @param InputInterface  $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $args = $input->getArgument('module');

        if ( is_dir( $this->pkg_path ) )
        {
            chdir( $this->pkg_path );

            if ( !is_dir( 'node_modules' ) )
            {
                $output->writeln("<comment>Node modules installation...</comment>");
                $this->installNodeModules();
            }

            if ( count( $args ) > 1 )
            {

                foreach ( $args as $arg )
                {
                    $output->writeln("<comment>Creating  " . $arg . "...</comment>");
                    passthru( "gulp create -- " . $arg . "  --color=always" );
                }
            }
        }
    }
}
