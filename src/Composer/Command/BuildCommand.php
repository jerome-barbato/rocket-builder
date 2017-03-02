<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class BuildCommand extends BuilderCommand
{
    protected function configure()
    {
        $this->setName('build');
        $this->addOption('production', 'p', InputOption::VALUE_NONE, 'Optimize assets.');
        $this->setHelp(<<<EOT
Precompile assets from sources.
EOT
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln("<comment>Starting building...</comment>");

        if ( is_dir( $this->pkg_path ) ) {

            chdir( $this->pkg_path );

            $options = $input->getOption('production') ? '-p' : '';

            if ( !is_dir( 'node_modules' ) ) {

                $output->writeln("<comment>Node modules installation...</comment>");
                $this->installNodeModules();
            }

            $output->writeln("<comment>Gulp execution...</comment>");
            passthru( "gulp " . $options . " --color=always" );
        }
    }
}
