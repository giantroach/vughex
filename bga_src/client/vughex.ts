/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Vughex implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * vughex.ts
 *
 * YourGameName user interface script
 *
 * In this file, you are describing the logic of your user interface, in Typescript language.
 *
 */

import { Dojo, Game, Player } from './types/framework.d';
import { Counter } from './types/counter.d';
import { Stock } from './types/stock.d';
import { VughexGamedatas } from './types/vughex.d';

declare const define: any;
declare const ebg: any;
declare const $: any;
declare const dojo: Dojo;
declare const g_gamethemeurl: string;

export class Vughex implements Game {
  private gamedatas: VughexGamedatas = {
    current_player_id: '',
    decision: { decision_type: '' },
    game_result_neutralized: '',
    gamestate: null,
    gamestates: {},
    neutralized_player_id: '',
    notifications: { last_packet_id: '', move_nbr: '' },
    playerorder: [],
    players: {},
    tablespeed: '',
  };
  private player_id: string = '';
  private players: { [playerId: number]: Player } = [];
  private playerNumber: number = 0;
  private handCounters: { [playerID: string]: Counter } = {};

  constructor() {
    console.log('vughex constructor');

    // Here, you can init the global variables of your user interface
    // Example:
    // this.myGlobalValue = 0;
  }

  /*
            setup:

            This method must set up the game user interface according to current game situation specified
            in parameters.

            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)

            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */

  public setup(gamedatas: any) {
    console.log('Starting game setup');

    // Setting up player boards
    for (let player_id in gamedatas.players) {
      const player = gamedatas.players[player_id];

      // TODO: Setting up players boards if needed

      // create handsize counter per player
      // const elmPb = $(`player_board_${player_id}`);
      // dojo.place(
      //     this.format_block('jstpl_player_board', player), elmPb);
      // this.handCounters[player_id] = new ebg.counter();
      // this.handCounters[player_id].create(`hand-count_p${player_id}`);
      // this.handCounters[player_id].setValue(player.cards);
    }

    // TODO: Set up your game interface here, according to "gamedatas"

    // Setup game notifications to handle (see "setupNotifications" method below)
    this.setupNotifications();

    console.log('Ending game setup');
  }

  ///////////////////////////////////////////////////
  //// Game & client states

  // onEnteringState: this method is called each time we are entering into a new game state.
  //                  You can use this method to perform some user interface changes at this moment.
  //
  public onEnteringState(stateName: string, args: any) {
    console.log('Entering state: ' + stateName);

    switch (stateName) {
      /* Example:

        case 'myGameState':

            // Show some HTML block at this game state
            dojo.style( 'my_html_block_id', 'display', 'block' );

            break;
        */

      case 'dummmy':
        break;
    }
  }

  // onLeavingState: this method is called each time we are leaving a game state.
  //                 You can use this method to perform some user interface changes at this moment.
  //
  public onLeavingState(stateName: string) {
    console.log('Leaving state: ' + stateName);

    switch (stateName) {
      /* Example:

        case 'myGameState':

            // Hide the HTML block we are displaying only during this game state
            dojo.style( 'my_html_block_id', 'display', 'none' );

            break;
        */

      case 'dummmy':
        break;
    }
  }

  // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
  //                        action status bar (ie: the HTML links in the status bar).
  //
  public onUpdateActionButtons(stateName: string, args: any) {
    console.log('onUpdateActionButtons: ' + stateName);

    if ((this as any).isCurrentPlayerActive()) {
      switch (
        stateName
        /*
                Example:

                case 'myGameState':

                // Add 3 action buttons in the action status bar:

                (this as any).addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
                (this as any).addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
                (this as any).addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
                break;
*/
      ) {
      }
    }
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  /*

        Here, you can defines some utility methods that you can use everywhere in your javascript
        script.

    */

  ///////////////////////////////////////////////////
  //// Player's action

  /*

        Here, you are defining methods to handle player's action (ex: results of mouse click on
        game objects).

        Most of the time, these methods:
        _ check the action is possible at this game state.
        _ make a call to the game server

    */

  /* Example:

    onMyMethodToCall1( evt ) {
        console.log( 'onMyMethodToCall1' );

        // Preventing default browser reaction
        dojo.stopEvent( evt );

        // Check that this action is possible (see "possibleactions" in states.inc.php)
        if( ! this.checkAction( 'myAction' ) )
        {   return; }

        this.ajaxcall( "/vughex/vughex/myAction.html", {
                                                                lock: true,
                                                                myArgument1: arg1,
                                                                myArgument2: arg2,
                                                                ...
                                                                },
                        this, result => {

                        // What to do after the server call if it succeeded
                        // (most of the time: nothing)

                        }, is_error => {

                        // What to do after the server call in anyway (success or failure)
                        // (most of the time: nothing)

                        } );
    },

    */

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /*
        setupNotifications:

        In this method, you associate each of your game notifications with your local method to handle it.

        Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                your vughex.game.php file.

    */
  setupNotifications() {
    console.log('notifications subscriptions setup');

    // TODO: here, associate your game notifications with local methods

    // Example 1: standard notification handling
    // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

    // Example 2: standard notification handling + tell the user interface to wait
    //            during 3 seconds after calling the method in order to let the players
    //            see what is happening in the game.
    // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
    // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
    //
  }

  // TODO: from this point and below, you can write your game notifications handling methods

  /*
    Example:

    notif_cardPlayed( notif ) {
        console.log( 'notif_cardPlayed' );
        console.log( notif );

        // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

        // TODO: play the card in the user interface.
    },

    */
}

define([
    'dojo',
    'dojo/_base/declare',
    'ebg/core/gamegui',
    'ebg/counter',
    'ebg/stock',
    g_gamethemeurl + "modules/chunk-vendors.js",
    g_gamethemeurl + "modules/app.js"
], function (dojo: Dojo, declare: any) {
    return declare('bgagame.vughex', ebg.core.gamegui, new Vughex());
});
