<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Vughex implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * Vughex game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


/*

Example:

$this->card_types = array(
    1 => array( "card_name" => ...,
                ...
              )
);

*/

$this->card_types = [
    (object) ["id" => "0", "name" => "the Oracle", "powerFixed" => 2, "powerCenter" => 1, "stealth" => false],
    (object) ["id" => "1", "name" => "the Reincarnation", "powerFixed" => 1, "powerCenter" => 1, "stealth" => false],
    (object) ["id" => "2", "name" => "the Justice", "powerFixed" => 0, "powerCenter" => 2, "stealth" => false],
    (object) ["id" => "3", "name" => "the Evil", "powerFixed" => 0, "powerCenter" => 3, "stealth" => false],
    (object) ["id" => "4", "name" => "the Unstable", "powerFixed" => 0, "powerCenter" => 1, "stealth" => false],
    (object) ["id" => "5", "name" => "the Watcher", "powerFixed" => 3, "powerCenter" => 1, "stealth" => false],
    (object) ["id" => "6", "name" => "the Crowd", "powerFixed" => 4, "powerCenter" => 1, "stealth" => false],
    (object) ["id" => "7", "name" => "the Maze", "powerFixed" => 4, "powerCenter" => 0, "stealth" => false],
    (object) ["id" => "8", "name" => "the Plague", "powerFixed" => 3, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "9", "name" => "the Titan", "powerFixed" => 7, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "10", "name" => "the Eclipse", "powerFixed" => 0, "powerCenter" => 1, "stealth" => true],
    (object) ["id" => "11", "name" => "the Agent", "powerFixed" => 2, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "12", "name" => "the Shadow", "powerFixed" => 5, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "13", "name" => "the Creeps", "powerFixed" => 1, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "14", "name" => "the Creeps", "powerFixed" => 1, "powerCenter" => 0, "stealth" => true],
    (object) ["id" => "15", "name" => "Stealth", "powerFixed" => 1, "powerCenter" => 0, "stealth" => true],
];
