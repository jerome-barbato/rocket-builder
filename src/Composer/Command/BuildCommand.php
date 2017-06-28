<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Command\BaseCommand;

use Symfony\Component\Console\Input\InputInterface,
	Symfony\Component\Console\Input\InputOption,
	Symfony\Component\Console\Output\OutputInterface;

/**
 * Class BuildCommand
 * Composer build command
 *
 * @see     doc/composer.md
 *
 * @package Rocket\Composer\Command
 */
class BuildCommand extends BuilderCommand
{
    /**
     * Command declaration
     */
    protected function configure()
    {
        $this->setName('build');
        $this->addOption('production', 'p', InputOption::VALUE_NONE, 'Optimize assets.');
        $this->setHelp(<<<EOT
Precompile assets from sources.
EOT
        );
    }

    /**
     * Command function
     *
     * @param InputInterface  $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln("<comment>Start building...</comment>");

        if ( is_dir( $this->pkg_path ) )
        {
            chdir( $this->pkg_path );

            $options = $input->getOption('production') ? '-p' : '';

            if ( !is_dir( 'node_modules' ) )
            {
                $output->writeln("<comment>Node modules installation...</comment>");
                $this->installNodeModules();
            }

            $output->writeln("<comment>Running Gulp...</comment>");
            passthru( "gulp " . $options . " --color=always" );
        }
    }
}