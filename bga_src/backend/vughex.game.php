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
  * vughex.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );


class Vughex extends Table
{
    function __construct( )
    {
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();

        self::initGameStateLabels(array(
            //    "my_first_global_variable" => 10,
            //    "my_second_global_variable" => 11,
            //      ...
            //    "my_first_game_variant" => 100,
            //    "my_second_game_variant" => 101,
            //      ...
        ));

        // create instance specifying card module
        $this->cards = self::getNew("module.common.deck");
        $this->cards->init("cards"); // specify cards table and init
    }

    protected function getGameName( )
    {
        // Used for translations and stuff. Please do not modify.
        return "vughex";
    }

    /*
      setupNewGame:

      This method is called only once, when a new game is launched.
      In this method, you must setup the game according to the game rules, so that
      the game is ready to be played.
    */
    protected function setupNewGame($players, $options = array())
    {
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('" . $player_id . "', '$color', '" . $player['player_canal'] . "', '" . addslashes($player['player_name']) . "','" . addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode($values, ',');
        self::DbQuery($sql);
        self::reattributeColorsBasedOnPreferences($players, $gameinfos['player_colors']);
        self::reloadPlayersBasicInfos();

        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here
        $cards = [];

        $players = self::getCollectionFromDb("SELECT player_id id FROM player");
        $numOfCards = 13;

        for ($cardNo = 1; $cardNo <= $numOfCards; $cardNo++) {
            $cards[] = [
                'type' => 'standard',
                'type_arg' => $cardNo,
                'nbr' => 1
            ];
        }
        $cards[] = [
            'type' => 'creep',
            'type_arg' => 14,
            'nbr' => 1
        ];
        $cards[] = [
            'type' => 'creep',
            'type_arg' => 15,
            'nbr' => 1
        ];

        $this->cards->createCards($cards, 'deck');
        $this->cards->shuffle('deck');

        $this->gamestate->nextState('roundSetup');

        /************ End of the game initialization *****/
    }

    /*
      getAllDatas:

      Gather all informations about current game situation (visible by the current player).

      The method is called each time the game interface is displayed to a player, ie:
      _ when the game starts
      _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();

        // !! We must only return informations visible by this player !!
        $current_player_id = self::getCurrentPlayerId();

        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb($sql);

        // TODO: Gather all information about current game situation (visible by player $current_player_id).
        // return number of cards in the hand
        foreach($result['players'] as $key => $value) {
            $player_id = $key;
            $count = count($this->cards->getCardsInLocation("hand", $player_id));
            $result['players'][$key]['cards'] = $count;
        }

        $result['player_cards'] = array_values(
            $this->cards->getCardsInLocation("hand", $current_player_id));

        // FIXME: Hide enemy stealth units
        $result['player_table'] = array_values(
            $this->cards->getCardsInLocation('table'. $current_player_id));

        $sql = "SELECT player_id id FROM player WHERE player_id<>'" . $current_player_id . "'";
        $oppo_id = self::getUniqueValueFromDB($sql);
        $result['oppo_table'] = array_values(
            $this->cards->getCardsInLocation('table' . $oppo_id));

        return $result;
    }

    /*
      getGameProgression:

      Compute and return the current game progression.
      The number returned must be an integer beween 0 (=the game just started) and
      100 (= the game is finished or almost finished).

      This method is called each time we are in a game state with the "updateGameProgression" property set to true
      (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Utility functions
    ////////////

    /*
      In this space, you can put any utility methods useful for your game logic
    */



    //////////////////////////////////////////////////////////////////////////////
    //////////// Player actions
    ////////////

    /*
      Each time a player is doing some game action, one of the methods below is called.
      (note: each method below must match an input method in vughex.action.php)
    */

    function playCard($cardID, $gridID)
    {
        self::dump('$cardID', $cardID);
        $cardInfo = $this->cards->getCard($cardID);
        $actorID = self::getActivePlayerId();

        if (!$cardInfo) {
            self::notifyPlayer($actorID, 'logError', '', [
                'message' => clienttranslate('Invalid card selection! You cannot choose it.')
            ]);
            return;
        }

        if ($cardInfo['location'] != 'hand' || $cardInfo['location_arg'] != $actorID) {
            self::notifyPlayer($actorID, 'logError', '', [
                'message' => clienttranslate('Invalid card selection! You cannot choose it.')
            ]);
            return;
        }

        // FIXME: check if the card is playable
        // $tCards = array_values(
        //     $this->cards->getCardsInLocation("ontable"));
        // usort($tCards, function ($a, $b) {
        //     return -($a['location_arg'] <=> $b['location_arg']);
        // });
        // $pCard = null;
        // if (count($tCards) > 1) {
        //     $pCard = $tCards[1];
        // }
        // if (!count($tCards) == 0 && !self::isCardPlayable($tCards[0], $cardInfo, $pCard, self::isEclipsed())) {
        //     self::notifyPlayer($actorID, 'logError', '', [
        //         'message' => clienttranslate('Invalid card selection! Reload the page.')
        //     ]);
        //     return;
        // }

        $this->cards->moveCard(
            $cardID,
            'table' . $actorID,
            $gridID,
        );

        $numberOfcards = $this->cards->countCardInLocation('hand', $actorID);

        // FIXME: hide card info if it is stealth
        self::notifyAllPlayers('playCard', clienttranslate('${player_name} played a card.'), [
            'player_id' => $actorID,
            'player_name' => self::getActivePlayerName(),
            'card' => $cardInfo,
            'cards' => $numberOfcards,
            'gridID' => $gridID,
        ]);

        $this->gamestate->nextState('nextPlayer');
    }

    function getNum($num)
    {
        $actorID = self::getActivePlayerId();
        self::notifyAllPlayers(
            "getNum",
            clienttranslate('${player_name} got ${num}.'),
            [
                "player_id" => $actorID,
                "player_name" => self::getActivePlayerName(),
                "num" => $num + 1,
            ]
        );

        $this->gamestate->nextState("nextPlayer");
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    ////////////

    /*
      Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
      These methods function is to return some additional information that is specific to the current
      game state.
    */

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    ////////////

    /*
      Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
      The action method of state X is called everytime the current game state is set to X.
    */

    function stRoundSetup()
    {
        $this->activeNextPlayer();

        // $this->cards->moveAllCardsInLocation(
        //     'ondiscard',
        //     'deck'
        // );
        // $this->cards->moveAllCardsInLocation(
        //     'ontable',
        //     'deck'
        // );
        // $this->cards->moveAllCardsInLocation(
        //     'hand',
        //     'deck'
        // );

        $players = self::getCollectionFromDb("SELECT player_id id, player_no FROM player");
        // deal appropriate creep
        $allCards = array_values(
            $this->cards->getCardsInLocation("deck")
        );
        // FIXME: should be shortcut like:
        // $creeps = $this->cards->getCardsOfType('creep', 14);
        $creepSun = null;
        $creepNgt = null;
        foreach ($allCards as $val) {
            if ($val['type_arg'] == 14) {
                $creepSun = $val;
            }
            if ($val['type_arg'] == 15) {
                $creepNgt = $val;
            }
        }
        foreach ($players as $playerID => $player) {
            // FIXME:
            if ($player['player_no'] == 1) {
                $this->cards->moveCard($creepSun['id'], 'hand', $playerID);
            }
            if ($player['player_no'] == 2) {
                $this->cards->moveCard($creepNgt['id'], 'hand', $playerID);
            }
        }

        foreach ($players as $playerID => $value) {
            $this->cards->pickCards(5, 'deck', $playerID);
        }

        // $players = self::getCollectionFromDb("SELECT player_id id FROM player");
        // // self::DbQuery("UPDATE player SET player_passed=0");

        // // FIXME: adjust who's turn is next (based on day and night)
        // $apID = $this->getActivePlayerId();
        // self::giveExtraTime($apID);
        // $sql = "SELECT player_id id, player_score score FROM player ";
        // $players = self::getCollectionFromDb($sql);

        // return number of cards in the hand
        foreach($players as $key => $value) {
            $player_id = $key;
            $count = count($this->cards->getCardsInLocation("hand", $player_id));
            $players[$key]['cards'] = $count;
        }

        foreach($players as $key => $value) {
            $player_id = $key;
            $player_cards = array_values(
                $this->cards->getCardsInLocation("hand", $player_id));

            self::notifyPlayer($player_id, 'newRound', clienttranslate('FIXME: New turn'), [
                'player_cards' => $player_cards,
                'players' => $players
            ]);
        }

        // $this->gamestate->nextState('playerTurn');
    }

    function stNextPlayer()
    {
        // $lastPlayerID = self::getActivePlayerId();

        // $allData = self::getAllDatas();

        // foreach ($allData['players'] as $playerID => $player) {
        //     if ($this->cards->countCardInLocation('hand', $lastPlayerID) <= 0) {
        //         $this->gamestate->nextState('endRound');
        //         return;
        //     }
        // }

        $playerID = self::activeNextPlayer();

        self::giveExtraTime($playerID);
        $this->gamestate->nextState('playerTurn');
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Zombie
    ////////////

    /*
      zombieTurn:

      This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
      You can do whatever you want in order to make sure the turn of this player ends appropriately
      (ex: pass).

      Important: your zombie code will be called when the player leaves the game. This action is triggered
      from the main site and propagated to the gameserver from a server, not from a browser.
      As a consequence, there is no current player associated to this action. In your zombieTurn function,
      you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message.
    */

    function zombieTurn($state, $active_player)
    {
        $statename = $state['name'];

        if ($state['type'] === "activeplayer") {
            switch ($statename) {
            default:
                $this->gamestate->nextState( "zombiePass" );
                break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive($active_player, '');

            return;
        }

        throw new feException("Zombie mode not supported at this game state: " . $statename);
    }

    ///////////////////////////////////////////////////////////////////////////////////:
    ////////// DB upgrade
    //////////

    /*
      upgradeTableDb:

      You don't have to care about this until your game has been published on BGA.
      Once your game is on BGA, this method is called everytime the system detects a game running with your old
      Database scheme.
      In this case, if you change your Database scheme, you just have to apply the needed changes in order to
      update the game database and allow the game to continue to run with your new version.

    */

    function upgradeTableDb($from_version)
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
        //        if( $from_version <= 1404301345 )
        //        {
        //            // ! important ! Use DBPREFIX_<table_name> for all tables
        //
        //            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
        //            self::applyDbUpgradeToAllDB( $sql );
        //        }
        //        if( $from_version <= 1405061421 )
        //        {
        //            // ! important ! Use DBPREFIX_<table_name> for all tables
        //
        //            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
        //            self::applyDbUpgradeToAllDB( $sql );
        //        }
        //        // Please add your future database scheme changes here
        //
        //

    }
}
