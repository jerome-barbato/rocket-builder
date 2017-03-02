<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class BuildCommand extends BaseCommand
{
    protected function configure()
    {
        $this->setName('build');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln( 'Executing' );
    }
}
