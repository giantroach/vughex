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

require_once APP_GAMEMODULE_PATH . "module/table/table.game.php";

class Vughex extends Table
{
  function __construct()
  {
    // Your global variables labels:
    //  Here, you can assign labels to global variables you are using for this game.
    //  You can use any number of global variables with IDs between 10 and 99.
    //  If your game has options (variants), you also have to associate here a label to
    //  the corresponding ID in gameoptions.inc.php.
    // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
    parent::__construct();

    self::initGameStateLabels([
      //    "my_first_global_variable" => 10,
      //    "my_second_global_variable" => 11,
      //      ...
      //    "my_first_game_variant" => 100,
      //    "my_second_game_variant" => 101,
      //      ...
    ]);

    // create instance specifying card module
    $this->cards = self::getNew("module.common.deck");
    $this->cards->init("cards"); // specify cards table and init
  }

  protected function getGameName()
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
  protected function setupNewGame($players, $options = [])
  {
    // Set the colors of the players with HTML color code
    // The default below is red/green/blue/orange/brown
    // The number of colors defined here must correspond to the maximum number of players allowed for the gams
    $gameinfos = self::getGameinfos();
    $default_colors = $gameinfos["player_colors"];

    // Create players
    // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
    $sql =
      "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
    $values = [];
    foreach ($players as $player_id => $player) {
      $color = array_shift($default_colors);
      $values[] =
        "('" .
        $player_id .
        "', '$color', '" .
        $player["player_canal"] .
        "', '" .
        addslashes($player["player_name"]) .
        "','" .
        addslashes($player["player_avatar"]) .
        "')";
    }
    $sql .= implode($values, ",");
    self::DbQuery($sql);
    self::reattributeColorsBasedOnPreferences(
      $players,
      $gameinfos["player_colors"]
    );
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
    $numOfCards = 12;

    for ($cardNo = 0; $cardNo <= $numOfCards; $cardNo++) {
      $cards[] = [
        "type" => "standard",
        "type_arg" => $cardNo,
        "nbr" => 1,
      ];
    }
    $cards[] = [
      "type" => "creep",
      "type_arg" => 13,
      "nbr" => 1,
    ];
    $cards[] = [
      "type" => "creep",
      "type_arg" => 14,
      "nbr" => 1,
    ];

    $this->cards->createCards($cards, "deck");
    $this->cards->shuffle("deck");

    // set day and night
    $sql = "INSERT INTO round (round_id, round_side) VALUES (1, '')";
    self::DbQuery($sql);

    // set center data
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (1, 'left', 0)"
    );
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (2, 'center', 0)"
    );
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (3, 'right', 0)"
    );

    $this->gamestate->nextState("roundSetup");

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
    $result = [];

    // !! We must only return informations visible by this player !!
    $current_player_id = self::getCurrentPlayerId();

    // Get information about players
    // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
    $sql = "SELECT player_id id, player_score score FROM player ";
    $result["players"] = self::getCollectionFromDb($sql);

    // TODO: Gather all information about current game situation (visible by player $current_player_id).
    // return number of cards in the hand
    foreach ($result["players"] as $key => $value) {
      $player_id = $key;
      $count = count($this->cards->getCardsInLocation("hand", $player_id));
      $result["players"][$key]["cards"] = $count;
    }

    $result["player_cards"] = array_values(
      $this->cards->getCardsInLocation("hand", $current_player_id)
    );

    // Hide enemy stealth units
    $result["player_table"] = $this->getCardsInLocation(
      "table" . $current_player_id
    );

    self::dump("player_table", $result["player_table"]);

    $sql =
      "SELECT player_id id FROM player WHERE player_id<>'" .
      $current_player_id .
      "'";
    $oppo_id = self::getUniqueValueFromDB($sql);
    $result["oppo_table"] = [];

    foreach ($this->getCardsInLocation("table" . $oppo_id) as $card) {
      $c = $this->card_types[intval($card["type_arg"])];
      // FIXME: it looks like getCardsInLocation does not return those newly added props..
      if ($c->stealth && !$card["meta"]) {
        $result["oppo_table"][] = [
          "id" => "0",
          "type" => "stealth",
          "type_arg" => "17",
          "location" => $card["location"],
          "location_arg" => $card["location_arg"],
        ];
      } else {
        $result["oppo_table"][] = $card;
      }
    }

    $sql = "SELECT round_side FROM round";
    $round_side = self::getUniqueValueFromDB($sql);
    $result["day_or_night"] = $round_side;

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

  function getOppoID($playerID)
  {
    $sql =
      "SELECT player_id id FROM player WHERE player_id<>'" . $playerID . "'";
    $oppoID = self::getUniqueValueFromDB($sql);
    return $oppoID;
  }

  function getPlayerName($playerID)
  {
    return self::getUniqueValueFromDB(
      "SELECT player_name FROM player WHERE player_id='" . $playerID . "'"
    );
  }

  function isEnabledCard($card, $id)
  {
    // FIXME: oracle
    if (intval($card["type_arg"]) === $id) {
      return true;
    }
    return false;
  }

  function getNewCenterValue($c, $center, $lane)
  {
    // 9: plague is the highest priority
    if ($this->isEnabledCard($c, 9)) {
      self::notifyAllPlayers(
        "score",
        clienttranslate(
          '[${lane} lane] center number is set to 0 by "the Plague").'
        ),
        [
          "lane" => $lane,
        ]
      );
      return 0;
    }
    // 2: Justice
    if ($this->isEnabledCard($c, 2)) {
      self::notifyAllPlayers(
        "score",
        clienttranslate(
          '[${lane} lane] center number is increased by 1 by "the Justice").'
        ),
        [
          "lane" => $lane,
        ]
      );
      return $center + 1;
    }
    // 12: Shadow
    if ($this->isEnabledCard($c, 12)) {
      self::notifyAllPlayers(
        "score",
        clienttranslate(
          '[${lane} lane] center number is decreased by 2 by "the Shadow").'
        ),
        [
          "lane" => $lane,
        ]
      );
      return $center - 2;
    }

    return $center;
  }

  function getPower($c, $center, $lane)
  {
    $cardInfo = $this->card_types[intval($c["type_arg"])];

    $powerFixed = $cardInfo->powerFixed;
    $powerCenter = $cardInfo->powerCenter;

    if ($this->isEnabledCard($c, 4) && ($center >= 6 || $center <= 0)) {
      self::notifyAllPlayers(
        "score",
        clienttranslate(
          '[${lane} lane] "the Unstable" became power 15 since center is ${center}.'
        ),
        [
          "lane" => $lane,
          "center" => $center,
        ]
      );
      return 15;
    }

    return $powerFixed + $powerCenter * $center;
  }

  function addScore($playerID)
  {
    $playerName = $this->getPlayerName($playerID);

    $score = intval(
      self::getUniqueValueFromDB(
        "SELECT player_score score FROM player WHERE player_id='" .
          $playerID .
          "'"
      )
    );
    $updatedScore = $score + 1;
    self::DbQuery(
      "UPDATE player SET player_score='" .
        $updatedScore .
        "' WHERE player_id='" .
        $playerID .
        "'"
    );

    // notify to update the score
    self::notifyAllPlayers(
      "updateScore",
      clienttranslate('${playerName} scored.'),
      [
        "playerID" => $playerID,
        "playerName" => $playerName,
      ]
    );
  }

  function setLaneController($playerID, $lane)
  {
    $sql =
      "UPDATE center SET center_controller='" .
      $playerID .
      "' WHERE center_location='" .
      $lane .
      "'";
    self::DbQuery($sql);
  }

  function hndlEvelAndAgent(
    int $wPlayerID,
    int $lPlayerID,
    int $hasEvil,
    int $hasAgent
  ) {
    if ($hasEvil) {
      if ($lPlayerID === $hasEvil) {
        // deal one damage!
        $playerName = $this->getPlayerName($lPlayerID);
        self::notifyAllPlayers(
          "score",
          clienttranslate('"the Evil" dealt 1 damage to ${playerName}.'),
          [
            "playerID" => $wPlayerID,
            "playerName" => $playerName,
          ]
        );
        $this->addScore($wPlayerID);
      }
    }
    if ($hasAgent) {
      if ($wPlayerID === $hasAgent) {
        // scores!
        $playerName = $this->getPlayerName($lPlayerID);
        self::notifyAllPlayers(
          "score",
          clienttranslate('"the Agent" dealt 1 damage to ${playerName}.'),
          [
            "playerID" => $wPlayerID,
            "playerName" => $playerName,
          ]
        );
        $this->addScore($wPlayerID);
      }
    }
  }

  function getCardsInLocation($location)
  {
    $sql = "SELECT ";
    $sql .= "card_id id, ";
    $sql .= "card_type type, ";
    $sql .= "card_type_arg type_arg, ";
    $sql .= "card_location location, ";
    $sql .= "card_location_arg location_arg, ";
    $sql .= "card_meta meta from cards ";
    $sql .= "WHERE card_location='" . $location . "'";
    return self::getObjectListFromDB($sql);
  }

  function getCard($cardID)
  {
    $sql = "SELECT ";
    $sql .= "card_id id, ";
    $sql .= "card_type type, ";
    $sql .= "card_type_arg type_arg, ";
    $sql .= "card_location location, ";
    $sql .= "card_location_arg location_arg, ";
    $sql .= "card_meta meta from cards ";
    $sql .= "WHERE card_id='" . $cardID . "'";
    return self::getObjectFromDB($sql);
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Player actions
  ////////////

  /*
      Each time a player is doing some game action, one of the methods below is called.
      (note: each method below must match an input method in vughex.action.php)
    */

  function playCard($cardID, $gridID, $targetGridID, $targetGridSide)
  {
    $cardInfo = $this->getCard($cardID);
    $actorID = self::getActivePlayerId();
    $oppoID = $this->getOppoID($actorID);

    if (!$cardInfo) {
      self::notifyPlayer($actorID, "logError", "", [
        "message" => clienttranslate(
          "Invalid card selection! You cannot choose it."
        ),
      ]);
      return;
    }

    if (
      $cardInfo["location"] != "hand" ||
      $cardInfo["location_arg"] != $actorID
    ) {
      self::notifyPlayer($actorID, "logError", "", [
        "message" => clienttranslate(
          "Invalid card selection! You cannot choose it."
        ),
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

    // FIXME: oracle
    if (intval($cardInfo["type_arg"]) === 0) {
      if ($targetGridID === null) {
        self::notifyPlayer($actorID, "logError", "", [
          "message" => clienttranslate(
            "Invalid target selection! You must select a target."
          ),
        ]);
        return;
      }

      // target player
      $targetPlayerID = $actorID;
      if ($targetGridSide != "player") {
        $targetPlayerID = $oppoID;
      }

      // get card info
      $sql =
        "SELECT card_id FROM cards WHERE card_location_arg='" .
        abs(intval($targetGridID)) .
        "' AND card_location='table" .
        $targetPlayerID .
        "'";
      $targetCardID = self::getUniqueValueFromDB($sql);
      $targetCardInfo = $this->getCard($targetCardID);

      // append meta
      $sql =
        "SELECT card_meta FROM cards WHERE card_id='" . $targetCardID . "'";
      $meta = self::getUniqueValueFromDB($sql);
      $meta .= "oracle,";
      $sql =
        "UPDATE cards SET card_meta='" .
        $meta .
        "' WHERE card_id='" .
        $targetCardID .
        "'";
      self::DbQuery($sql);
      $targetCardInfo["meta"] = $meta;

      // reveal notification
      self::notifyAllPlayers(
        "updateCard",
        clienttranslate('"the Oracle" disabled stealth and [Combat] ability.'),
        [
          "player_id" => $targetPlayerID,
          "player_name" => $this->getPlayerName($targetPlayerID),
          "card" => $targetCardInfo,
          "gridID" => abs(intval($targetGridID)),
        ]
      );
    }

    $this->cards->moveCard($cardID, "table" . $actorID, $gridID);

    $numberOfcards = $this->cards->countCardInLocation("hand", $actorID);

    self::notifyPlayer(
      $actorID,
      "playCard",
      clienttranslate('${player_name} played a card.'),
      [
        "player_id" => $actorID,
        "player_name" => self::getActivePlayerName(),
        "card" => $cardInfo,
        "cards" => $numberOfcards,
        "gridID" => $gridID,
      ]
    );

    $c = $this->card_types[intval($cardInfo["type_arg"])];
    if ($c->stealth) {
      self::notifyPlayer(
        $oppoID,
        "playCard",
        clienttranslate('${player_name} played a stealth card.'),
        [
          "player_id" => $actorID,
          "player_name" => self::getActivePlayerName(),
          "card" => [
            "id" => "0",
            "type" => "stealth",
            "type_arg" => "17",
            "location" => $cardInfo["location"],
            "location_arg" => $cardInfo["location_arg"],
          ],
          "cards" => $numberOfcards,
          "gridID" => $gridID,
        ]
      );
    } else {
      self::notifyPlayer(
        $oppoID,
        "playCard",
        clienttranslate('${player_name} played a card.'),
        [
          "player_id" => $actorID,
          "player_name" => self::getActivePlayerName(),
          "card" => $cardInfo,
          "cards" => $numberOfcards,
          "gridID" => $gridID,
        ]
      );
    }

    $this->gamestate->nextState("nextPlayer");
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
    // FIXME: flip day and night
    $sql = "SELECT round_side FROM round";
    $round_side = self::getUniqueValueFromDB($sql);
    if ($round_side != "day") {
      // either day or '' (initial)
      self::DbQuery("UPDATE round SET round_side='day'");
      $round_side = "day";
    } else {
      self::DbQuery("UPDATE round SET round_side='night'");
      $round_side = "night";
    }

    // this is needed for new round (not the initial)
    $this->cards->moveAllCardsInLocation(null, "deck");

    // clear card meta
    $sql = "UPDATE cards SET card_meta = ''";
    self::DbQuery($sql);

    $players = self::getCollectionFromDb(
      "SELECT player_id id, player_no FROM player"
    );
    // deal appropriate creep
    $allCards = array_values($this->cards->getCardsInLocation("deck"));
    self::dump('stRoundSetup:$allCards', $allCards);

    // FIXME: should be shortcut like:
    // $creeps = $this->cards->getCardsOfType('creep', 14);
    $creepSun = null;
    $creepNgt = null;
    foreach ($allCards as $val) {
      if ($val["type_arg"] == 13) {
        $creepSun = $val;
      }
      if ($val["type_arg"] == 14) {
        $creepNgt = $val;
      }
    }
    foreach ($players as $playerID => $player) {
      // FIXME:
      if ($player["player_no"] == 1) {
        $this->cards->moveCard($creepSun["id"], "hand", $playerID);
      }
      if ($player["player_no"] == 2) {
        $this->cards->moveCard($creepNgt["id"], "hand", $playerID);
      }
    }

    foreach ($players as $playerID => $value) {
      $this->cards->pickCards(5, "deck", $playerID);
    }

    // $players = self::getCollectionFromDb("SELECT player_id id FROM player");
    // // self::DbQuery("UPDATE player SET player_passed=0");

    // // FIXME: adjust who's turn is next (based on day and night)
    // $apID = $this->getActivePlayerId();
    // self::giveExtraTime($apID);
    // $sql = "SELECT player_id id, player_score score FROM player ";
    // $players = self::getCollectionFromDb($sql);

    // return number of cards in the hand
    foreach ($players as $key => $value) {
      $player_id = $key;
      $count = count($this->cards->getCardsInLocation("hand", $player_id));
      $players[$key]["cards"] = $count;
    }

    // return center controller data
    $sql =
      "SELECT center_location location, center_controller controller FROM center";
    $center = self::getCollectionFromDb($sql);

    foreach ($players as $key => $value) {
      $player_id = $key;
      $player_cards = array_values(
        $this->cards->getCardsInLocation("hand", $player_id)
      );

      self::notifyPlayer(
        $player_id,
        "newRound",
        clienttranslate("FIXME: New turn"),
        [
          "player_cards" => $player_cards,
          "players" => $players,
          "day_or_night" => $round_side,
          "center" => $center,
        ]
      );
    }

    $actorID = self::getActivePlayerId();
    if (!$actorID) {
      $this->activeNextPlayer();
    } else {
      $this->gamestate->nextState("playerTurn");
    }
  }

  function stNextPlayer()
  {
    $allData = self::getAllDatas();

    foreach ($allData["players"] as $playerID => $player) {
      // if any player has a card, go next player
      if ($this->cards->countCardInLocation("hand", $playerID) > 0) {
        $playerID = self::activeNextPlayer();

        self::giveExtraTime($playerID);
        $this->gamestate->nextState("playerTurn");

        return;
      }
    }

    $this->gamestate->nextState("endRound");
  }

  function stEndRound()
  {
    $allData = self::getAllDatas();

    $result = [
      "score" => [],
      "table" => [],
    ];

    // set default center value
    $result["score"]["center"] = [2, 3, 6];
    $sql = "SELECT round_side FROM round";
    $round_side = self::getUniqueValueFromDB($sql);
    if ($round_side == "night") {
      $result["score"]["center"] = [1, 4, 5];
    }

    // get the controller (player) for each center
    $sql =
      "SELECT center_location location, center_controller controller FROM center";
    $centerCtrler = self::getCollectionFromDb($sql);

    // get all cards on table
    $tableCards = [];
    foreach ($allData["players"] as $playerID => $player) {
      $tableCards[$playerID] = array_values(
        $this->cards->getCardsInLocation("table" . $playerID)
      );
    }

    // update center value
    foreach ($allData["players"] as $playerID => $player) {
      foreach ($tableCards[$playerID] as $c) {
        $posID = $c["location_arg"];

        switch ($posID) {
          case 0:
            $result["score"]["center"][0] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][0],
              "left"
            );
            break;
          case 1:
            $result["score"]["center"][1] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][1],
              "center"
            );
            break;
          case 2:
            $result["score"]["center"][2] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][2],
              "right"
            );
            break;
          case 3:
            $result["score"]["center"][0] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][0],
              "left"
            );
            break;
          case 4:
            $result["score"]["center"][1] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][1],
              "center"
            );
            break;
          case 5:
            $result["score"]["center"][2] = $this->getNewCenterValue(
              $c,
              $result["score"]["center"][2],
              "right"
            );
            break;
        }
      }
    }

    // lane data (total score for each lane)
    $laneScore = [];
    $hasEclipse = [false, false, false];
    $hasTitan = [false, false, false];
    $hasEvil = [0, 0, 0];
    $hasAgent = [0, 0, 0];

    foreach ($allData["players"] as $playerID => $player) {
      self::dump('$playerID', $playerID);

      $tmpResult = [];

      foreach ($tableCards[$playerID] as $c) {
        $cardInfo = $this->card_types[intval($c["type_arg"])];
        $posID = $c["location_arg"];

        $powerFixed = $cardInfo->powerFixed;
        $powerCenter = $cardInfo->powerCenter;
        self::dump('$cardInfo->name', $cardInfo->name);
        self::dump('$powerFixed', $powerFixed);
        self::dump('$powerCenter', $powerCenter);

        // 0 - 1 - 2
        // 3 - 4 - 5
        switch ($posID) {
          case 0:
            $center = $result["score"]["center"][0];
            $tmpResult[$posID] = $this->getPower($c, $center, "left");
            $hasEclipse[0] = $hasEclipse[0] || $this->isEnabledCard($c, 7);
            $hasTitan[0] = $hasTitan[0] || $this->isEnabledCard($c, 10);
            $hasEvil[0] =
              $hasEvil[0] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[0] =
              $hasAgent[0] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
          case 1:
            $center = $result["score"]["center"][1];
            $tmpResult[$posID] = $this->getPower($c, $center, "center");
            $hasEclipse[1] = $hasEclipse[1] || $this->isEnabledCard($c, 7);
            $hasTitan[1] = $hasTitan[1] || $this->isEnabledCard($c, 10);
            $hasEvil[1] =
              $hasEvil[1] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[1] =
              $hasAgent[1] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
          case 2:
            $center = $result["score"]["center"][2];
            $tmpResult[$posID] = $this->getPower($c, $center, "right");
            $hasEclipse[2] = $hasEclipse[2] || $this->isEnabledCard($c, 7);
            $hasTitan[2] = $hasTitan[2] || $this->isEnabledCard($c, 10);
            $hasEvil[2] =
              $hasEvil[2] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[2] =
              $hasAgent[2] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
          case 3:
            $center = $result["score"]["center"][0];
            $tmpResult[$posID] = $this->getPower($c, $center, "left");
            $hasEclipse[0] = $hasEclipse[0] || $this->isEnabledCard($c, 7);
            $hasTitan[0] = $hasTitan[0] || $this->isEnabledCard($c, 10);
            $hasEvil[0] =
              $hasEvil[0] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[0] =
              $hasAgent[0] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
          case 4:
            $center = $result["score"]["center"][1];
            $tmpResult[$posID] = $this->getPower($c, $center, "center");
            $hasEclipse[1] = $hasEclipse[1] || $this->isEnabledCard($c, 7);
            $hasTitan[1] = $hasTitan[1] || $this->isEnabledCard($c, 10);
            $hasEvil[1] =
              $hasEvil[1] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[1] =
              $hasAgent[1] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
          case 5:
            $center = $result["score"]["center"][2];
            $tmpResult[$posID] = $this->getPower($c, $center, "right");
            $hasEclipse[2] = $hasEclipse[2] || $this->isEnabledCard($c, 7);
            $hasTitan[2] = $hasTitan[2] || $this->isEnabledCard($c, 10);
            $hasEvil[2] =
              $hasEvil[2] || $this->isEnabledCard($c, 3) ? $playerID : false;
            $hasAgent[2] =
              $hasAgent[2] || $this->isEnabledCard($c, 11) ? $playerID : false;
            break;
        }
      }
      $result["score"][$playerID] = $tmpResult;
      $result["table"][$playerID] = array_values(
        $this->cards->getCardsInLocation("table" . $playerID)
      );

      self::dump('$hasEclipse', $hasEclipse);
      self::dump('$hasTitan', $hasTitan);

      // update center controller
      if (count($laneScore) == 0) {
        $laneScore[0] = $tmpResult[0] + $tmpResult[3];
        $laneScore[1] = $tmpResult[1] + $tmpResult[4];
        $laneScore[2] = $tmpResult[2] + $tmpResult[5];
        $laneScore["player"] = $playerID;
      } else {
        foreach ($laneScore as $pos => $score) {
          if ($pos === "player") {
            continue;
          }

          $lane = "left";
          if ($pos == 1) {
            $lane = "center";
          }
          if ($pos == 2) {
            $lane = "right";
          }

          if ($score == $tmpResult[$pos] + $tmpResult[$pos + 3]) {
            self::notifyAllPlayers(
              "score",
              clienttranslate('${lane} lane is tied by ${score}.'),
              [
                "lane" => $lane,
                "score" => $score,
              ]
            );

            continue;
          }

          $score2 = $tmpResult[$pos] + $tmpResult[$pos + 3];

          if ($hasEclipse[$pos] && abs($score - $score2) >= 4) {
            self::notifyAllPlayers(
              "score",
              clienttranslate(
                '[${lane} lane] is tied by ${score} vs ${score2} (tied by "the Eclipse").'
              ),
              [
                "lane" => $lane,
                "score" => $score,
                "score2" => $score2,
              ]
            );
            continue;
          }

          if (
            (!$hasTitan[$pos] && $score < $score2) ||
            ($hasTitan[$pos] && $score > $score2)
          ) {
            if ($hasTitan[$pos]) {
              self::notifyAllPlayers(
                "score",
                clienttranslate(
                  '[${lane} lane] ${player} won: ${scoreW} (vs ${scoreL}, lower won due to "the Titan").'
                ),
                [
                  "lane" => $lane,
                  "scoreW" => $score2,
                  "scoreL" => $score,
                  "player" => $this->getPlayerName($playerID),
                ]
              );
            } else {
              self::notifyAllPlayers(
                "score",
                clienttranslate(
                  '[${lane} lane] ${player} won: ${scoreW} (vs ${scoreL}).'
                ),
                [
                  "lane" => $lane,
                  "scoreW" => $score2,
                  "scoreL" => $score,
                  "player" => $this->getPlayerName($playerID),
                ]
              );
            }
            $this->hndlEvelAndAgent(
              $playerID,
              $laneScore["player"],
              $hasEvil[$pos],
              $hasAgent[$pos]
            );
            if (intval($centerCtrler[$lane]["controller"]) === $playerID) {
              $this->addScore($playerID);
            } else {
              $this->setLaneController($playerID, $lane);
            }
          }

          if (
            (!$hasTitan[$pos] && $score > $score2) ||
            ($hasTitan[$pos] && $score < $score2)
          ) {
            if ($hasTitan[$pos]) {
              self::notifyAllPlayers(
                "score",
                clienttranslate(
                  '[${lane} lane] ${player} won: ${scoreW} (vs ${scoreL}, lower won due to "the Titan").'
                ),
                [
                  "lane" => $lane,
                  "scoreW" => $score,
                  "scoreL" => $score2,
                  "player" => $this->getPlayerName($laneScore["player"]),
                ]
              );
            } else {
              self::notifyAllPlayers(
                "score",
                clienttranslate(
                  '[${lane} lane] ${player} won: ${scoreW} (vs ${scoreL}).'
                ),
                [
                  "lane" => $lane,
                  "scoreW" => $score,
                  "scoreL" => $score2,
                  "player" => $this->getPlayerName($laneScore["player"]),
                ]
              );
            }
            $this->hndlEvelAndAgent(
              $laneScore["player"],
              $playerID,
              $hasEvil[$pos],
              $hasAgent[$pos]
            );
            if (
              intval($centerCtrler[$lane]["controller"]) ===
              $laneScore["player"]
            ) {
              $this->addScore($laneScore["player"]);
            } else {
              $this->setLaneController($laneScore["player"], $lane);
            }
          }
        }
      }
      self::dump('$tmpResult', $tmpResult);
    }

    $sql =
      "SELECT center_location location, center_controller controller FROM center";
    $result["center"] = self::getCollectionFromDb($sql);

    // day or night
    $sql = "SELECT round_side FROM round";
    $result["day_or_night"] = self::getUniqueValueFromDB($sql);

    self::notifyAllPlayers(
      "endRound",
      clienttranslate("Round Ended."),
      $result
    );
    $this->gamestate->nextState("roundSetup");
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
    $statename = $state["name"];

    if ($state["type"] === "activeplayer") {
      switch ($statename) {
        default:
          $this->gamestate->nextState("zombiePass");
          break;
      }

      return;
    }

    if ($state["type"] === "multipleactiveplayer") {
      // Make sure player is in a non blocking status for role turn
      $this->gamestate->setPlayerNonMultiactive($active_player, "");

      return;
    }

    throw new feException(
      "Zombie mode not supported at this game state: " . $statename
    );
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
