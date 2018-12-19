<?php
/**
 * User: Paul Coudeville <paul@metabolism.fr>
 */

namespace Rocket\Composer;


use Composer\Composer,
    Composer\IO\IOInterface,
    Composer\Plugin\Capable,
    Composer\Plugin\PluginInterface;

/**
 * Class BuilderPlugin
 * Allows to register a plugin with Composer
 *
 * @package Rocket\Composer
 */
class BuilderPlugin implements PluginInterface, Capable
{
    /**
     * Plugin activation function, must be implemented.
     *
     * @param Composer    $composer
     * @param IOInterface $io
     */
    public function activate(Composer $composer, IOInterface $io)
    {

    }

    /**
     * Permit to handle specific Composer Events, in that case Commands
     * @return array
     */
    public function getCapabilities()
    {
        return [
            'Composer\Plugin\Capability\CommandProvider' => 'Rocket\Composer\Command\BuilderCommandProvider'
        ];
    }
}
