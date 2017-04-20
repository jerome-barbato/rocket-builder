<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Plugin\Capability\CommandProvider as CommandProviderCapability;

/**
 * Class BuilderCommandProvider
 *
 * @package Rocket\Composer\Command
 */
class BuilderCommandProvider implements CommandProviderCapability
{
    /**
     * List all available commands
     *
     * @return array
     */
    public function getCommands()
    {
        return array(new BuildCommand(), new CreateCommand());
    }
}
