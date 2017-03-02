<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer\Command;

use Composer\Plugin\Capability\CommandProvider as CommandProviderCapability;

class BuilderCommandProvider implements CommandProviderCapability
{
    public function getCommands()
    {
        return array(new BuildCommand(), new CreateCommand());
    }
}
