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

import { Dojo, Game, Player } from "./type/framework.d";
import { Counter } from "./type/counter.d";
import { Gamedata } from "./type/gamedata.d";
import { BgaRequest } from "./type/bga-interface.d";

declare const define: any;
declare const ebg: any;
declare const $: any;
declare const _: any;
declare const dojo: Dojo;
declare const g_gamethemeurl: string;

const appName = "vughex";

define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  g_gamethemeurl + "modules/chunk-vendors.js",
  g_gamethemeurl + "modules/app.js",
], function (dojo: Dojo, declare: any) {
  let vue: any = null;
  return declare("bgagame.vughex", ebg.core.gamegui, {
    constructor: function () {
      // Here, you can init the global variables of your user interface
      // Example:
      // this.myGlobalValue = 0;
      vue = (window as any)["vue"];
      vue.urlBase.value = g_gamethemeurl;
    },

    /*
      setup:

      This method must set up the game user interface according to current game situation specified
      in parameters.

      The method is called each time the game interface is displayed to a player, ie:
      _ when the game starts
      _ when a player refreshes the game page (F5)

      "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */

    setup: function (gamedatas: Gamedata) {
      console.log("Starting game setup");

      // Setting up player boards
      for (var player_id in gamedatas.players) {
        var player = gamedatas.players[player_id];

        // TODO: Setting up players boards if needed
      }

      // TODO: Set up your game interface here, according to "gamedatas"
      this.refreshGamedata(gamedatas);
      vue.playerID = this.player_id;

      // Setup game notifications to handle (see "setupNotifications" method below)
      this.setupNotifications();
      this.setupActions();

      console.log("Ending game setup");
    },

    refreshGamedata: function (gamedatas: Gamedata) {
      (Object.keys(gamedatas) as (keyof Gamedata)[]).forEach((prop) => {
        vue.gamedata[prop] = gamedatas[prop];
      });
    },

    ///////////////////////////////////////////////////
    //// Game & client states

    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    onEnteringState: function (stateName: string, args: any) {
      console.log("Entering state: " + stateName);

      switch (stateName) {
        case "roundSetup":
          vue.bgaStates.push("roundSetup");
          break;

        case "playerTurn":
          if (this.isCurrentPlayerActive()) {
            vue.bgaStates.push("playerTurn:init");
          }
          break;

        case "endRound":
          vue.bgaStates.push("endRound");
          break;

        case "dummmy":
          break;
      }
    },

    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    onLeavingState: function (stateName: string) {
      console.log("Leaving state: " + stateName);

      switch (stateName) {
        case "playerTurn":
          vue.bgaStates.push("waitingForOtherPlayer");
          break;

        case "dummmy":
          break;
      }
    },

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    onUpdateActionButtons: function (stateName: string, args: any) {
      console.log("onUpdateActionButtons: " + stateName);

      if (this.isCurrentPlayerActive()) {
        switch (
          stateName
          /*
              Example:

              case 'myGameState':

              // Add 3 action buttons in the action status bar:

              this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
              this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
              this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
              break;
            */
        ) {
        }
      }
    },

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

       onMyMethodToCall1: function( evt )
       {
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
       this, function( result ) {

       // What to do after the server call if it succeeded
       // (most of the time: nothing)

       }, function( is_error) {

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
    setupNotifications: function () {
      console.log("notifications subscriptions setup");

      // TODO: here, associate your game notifications with local methods

      // Example 1: standard notification handling
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

      // Example 2: standard notification handling + tell the user interface to wait
      //            during 3 seconds after calling the method in order to let the players
      //            see what is happening in the game.
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
      // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
      //

      dojo.subscribe("updateScore", this, (data: any) => {
        this.scoreCtrl[data.args.playerID].incValue(1);
      });

      const notifications = ["newRound", "getNum", "playCard", "moveCard", "updateCard", "endRound"];
      notifications.forEach((n) => {
        dojo.subscribe(n, this, (data: any) => {
          vue.bgaNotifications.push({
            name: n,
            args: data.args,
          });
        });
      });
    },

    // TODO: from this point and below, you can write your game notifications handling methods

    /*
      Example:

      notif_cardPlayed: function( notif )
      {
      console.log( 'notif_cardPlayed' );
      console.log( notif );

      // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

      // TODO: play the card in the user interface.
      },

    */

    setupActions: function () {
      vue.$watch("bgaRequest", (req: BgaRequest | null) => {
        if (!req) {
          return;
        }
        const reqBase = `/${appName}/${appName}`;
        const url = `${reqBase}/${req.name}.html`;
        vue.bgaRequestPromise = new Promise((resolve, reject) => {
          this.ajaxcall(
            url,
            req.args,
            this,
            (result: any) => {
              resolve(result);
            },
            (error: boolean) => {
              // this is called even if it success
              if (error) {
                reject(error);
              }
            },
          );
        });
      });
    },
  });
});
