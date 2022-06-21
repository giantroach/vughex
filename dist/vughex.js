/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./bga_src/client/vughex.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vughex": function() { return /* binding */ Vughex; }
/* harmony export */ });
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
var Vughex = /** @class */ (function () {
    function Vughex() {
        Object.defineProperty(this, "gamedatas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
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
            }
        });
        Object.defineProperty(this, "player_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "players", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "playerNumber", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "handCounters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
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
    Object.defineProperty(Vughex.prototype, "setup", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (gamedatas) {
            console.log('Starting game setup');
            // Setting up player boards
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
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
    });
    ///////////////////////////////////////////////////
    //// Game & client states
    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    Object.defineProperty(Vughex.prototype, "onEnteringState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (stateName, args) {
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
    });
    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    Object.defineProperty(Vughex.prototype, "onLeavingState", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (stateName) {
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
    });
    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    Object.defineProperty(Vughex.prototype, "onUpdateActionButtons", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (stateName, args) {
            console.log('onUpdateActionButtons: ' + stateName);
            if (this.isCurrentPlayerActive()) {
                switch (stateName
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
    });
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
    Object.defineProperty(Vughex.prototype, "setupNotifications", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
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
    });
    return Vughex;
}());

define([
    'dojo',
    'dojo/_base/declare',
    'ebg/core/gamegui',
    'ebg/counter',
    'ebg/stock',
    g_gamethemeurl + "modules/chunk-vendors.js",
    g_gamethemeurl + "modules/app.js"
], function (dojo, declare) {
    return declare('bgagame.vughex', ebg.core.gamegui, new Vughex());
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVnaGV4LmpzIiwibWFwcGluZ3MiOiI7O1VBQUE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFhSDtJQWtCRTtRQWpCQTs7OzttQkFBcUM7Z0JBQ25DLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3JCLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUU7Z0JBQy9CLHVCQUF1QixFQUFFLEVBQUU7Z0JBQzNCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFVBQVUsRUFBRSxFQUFFO2dCQUNkLHFCQUFxQixFQUFFLEVBQUU7Z0JBQ3pCLGFBQWEsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtnQkFDbkQsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLEVBQUU7YUFDZjtXQUFDO1FBQ0Y7Ozs7bUJBQTRCLEVBQUU7V0FBQztRQUMvQjs7OzttQkFBa0QsRUFBRTtXQUFDO1FBQ3JEOzs7O21CQUErQixDQUFDO1dBQUM7UUFDakM7Ozs7bUJBQXdELEVBQUU7V0FBQztRQUd6RCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbEMsaUVBQWlFO1FBQ2pFLFdBQVc7UUFDWCwwQkFBMEI7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7Ozs7OztZQVdROzs7OztlQUVSLFVBQWEsU0FBYztZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFbkMsMkJBQTJCO1lBQzNCLEtBQUssSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtnQkFDdkMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFNUMsNENBQTRDO2dCQUU1QyxxQ0FBcUM7Z0JBQ3JDLGdEQUFnRDtnQkFDaEQsY0FBYztnQkFDZCwrREFBK0Q7Z0JBQy9ELG9EQUFvRDtnQkFDcEQsbUVBQW1FO2dCQUNuRSx1REFBdUQ7YUFDeEQ7WUFFRCxrRUFBa0U7WUFFbEUsNkVBQTZFO1lBQzdFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNuQyxDQUFDOztJQUVELG1EQUFtRDtJQUNuRCx5QkFBeUI7SUFFekIsMEZBQTBGO0lBQzFGLGtHQUFrRztJQUNsRyxFQUFFOzs7OztlQUNGLFVBQXVCLFNBQWlCLEVBQUUsSUFBUztZQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBRTVDLFFBQVEsU0FBUyxFQUFFO2dCQUNqQjs7Ozs7Ozs7b0JBUUk7Z0JBRUosS0FBSyxRQUFRO29CQUNYLE1BQU07YUFDVDtRQUNILENBQUM7O0lBRUQsK0VBQStFO0lBQy9FLGlHQUFpRztJQUNqRyxFQUFFOzs7OztlQUNGLFVBQXNCLFNBQWlCO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFFM0MsUUFBUSxTQUFTLEVBQUU7Z0JBQ2pCOzs7Ozs7OztvQkFRSTtnQkFFSixLQUFLLFFBQVE7b0JBQ1gsTUFBTTthQUNUO1FBQ0gsQ0FBQzs7SUFFRCxrR0FBa0c7SUFDbEcsbUZBQW1GO0lBQ25GLEVBQUU7Ozs7O2VBQ0YsVUFBNkIsU0FBaUIsRUFBRSxJQUFTO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFFbkQsSUFBSyxJQUFZLENBQUMscUJBQXFCLEVBQUUsRUFBRTtnQkFDekMsUUFDRSxTQUFTO2dCQUNUOzs7Ozs7Ozs7OztVQVdOO2tCQUNNO2lCQUNEO2FBQ0Y7UUFDSCxDQUFDOztJQUVELG1EQUFtRDtJQUNuRCxvQkFBb0I7SUFFcEI7Ozs7O1FBS0k7SUFFSixtREFBbUQ7SUFDbkQsb0JBQW9CO0lBRXBCOzs7Ozs7Ozs7UUFTSTtJQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBK0JJO0lBRUosbURBQW1EO0lBQ25ELHFDQUFxQztJQUVyQzs7Ozs7Ozs7UUFRSTs7Ozs7ZUFDSjtZQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUVqRCxtRUFBbUU7WUFFbkUsNENBQTRDO1lBQzVDLDREQUE0RDtZQUU1RCw4RUFBOEU7WUFDOUUsbUZBQW1GO1lBQ25GLGdEQUFnRDtZQUNoRCw0REFBNEQ7WUFDNUQsd0RBQXdEO1lBQ3hELEVBQUU7UUFDSixDQUFDOztJQWlCSCxhQUFDO0FBQUQsQ0FBQzs7QUFFRCxNQUFNLENBQUM7SUFDSCxNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsV0FBVztJQUNYLGNBQWMsR0FBRywwQkFBMEI7SUFDM0MsY0FBYyxHQUFHLGdCQUFnQjtDQUNwQyxFQUFFLFVBQVUsSUFBVSxFQUFFLE9BQVk7SUFDakMsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdnVnaGV4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Z1Z2hleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdnVnaGV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdnVnaGV4L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdnVnaGV4Ly4vYmdhX3NyYy9jbGllbnQvdnVnaGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKlxuICotLS0tLS1cbiAqIEJHQSBmcmFtZXdvcms6IMKpIEdyZWdvcnkgSXNhYmVsbGkgPGdpc2FiZWxsaUBib2FyZGdhbWVhcmVuYS5jb20+ICYgRW1tYW51ZWwgQ29saW4gPGVjb2xpbkBib2FyZGdhbWVhcmVuYS5jb20+XG4gKiBWdWdoZXggaW1wbGVtZW50YXRpb24gOiDCqSBUb21va2kgTW90b2hhc2hpIDx0b21va2kubW90b2hhc2hpQHRha29hc2hpLmNvbT5cbiAqXG4gKiBUaGlzIGNvZGUgaGFzIGJlZW4gcHJvZHVjZWQgb24gdGhlIEJHQSBzdHVkaW8gcGxhdGZvcm0gZm9yIHVzZSBvbiBodHRwOi8vYm9hcmRnYW1lYXJlbmEuY29tLlxuICogU2VlIGh0dHA6Ly9lbi5ib2FyZGdhbWVhcmVuYS5jb20vIyFkb2MvU3R1ZGlvIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICogLS0tLS1cbiAqXG4gKiB2dWdoZXgudHNcbiAqXG4gKiBZb3VyR2FtZU5hbWUgdXNlciBpbnRlcmZhY2Ugc2NyaXB0XG4gKlxuICogSW4gdGhpcyBmaWxlLCB5b3UgYXJlIGRlc2NyaWJpbmcgdGhlIGxvZ2ljIG9mIHlvdXIgdXNlciBpbnRlcmZhY2UsIGluIFR5cGVzY3JpcHQgbGFuZ3VhZ2UuXG4gKlxuICovXG5cbmltcG9ydCB7IERvam8sIEdhbWUsIFBsYXllciB9IGZyb20gJy4vdHlwZXMvZnJhbWV3b3JrLmQnO1xuaW1wb3J0IHsgQ291bnRlciB9IGZyb20gJy4vdHlwZXMvY291bnRlci5kJztcbmltcG9ydCB7IFN0b2NrIH0gZnJvbSAnLi90eXBlcy9zdG9jay5kJztcbmltcG9ydCB7IFZ1Z2hleEdhbWVkYXRhcyB9IGZyb20gJy4vdHlwZXMvdnVnaGV4LmQnO1xuXG5kZWNsYXJlIGNvbnN0IGRlZmluZTogYW55O1xuZGVjbGFyZSBjb25zdCBlYmc6IGFueTtcbmRlY2xhcmUgY29uc3QgJDogYW55O1xuZGVjbGFyZSBjb25zdCBkb2pvOiBEb2pvO1xuZGVjbGFyZSBjb25zdCBnX2dhbWV0aGVtZXVybDogc3RyaW5nO1xuXG5leHBvcnQgY2xhc3MgVnVnaGV4IGltcGxlbWVudHMgR2FtZSB7XG4gIHByaXZhdGUgZ2FtZWRhdGFzOiBWdWdoZXhHYW1lZGF0YXMgPSB7XG4gICAgY3VycmVudF9wbGF5ZXJfaWQ6ICcnLFxuICAgIGRlY2lzaW9uOiB7IGRlY2lzaW9uX3R5cGU6ICcnIH0sXG4gICAgZ2FtZV9yZXN1bHRfbmV1dHJhbGl6ZWQ6ICcnLFxuICAgIGdhbWVzdGF0ZTogbnVsbCxcbiAgICBnYW1lc3RhdGVzOiB7fSxcbiAgICBuZXV0cmFsaXplZF9wbGF5ZXJfaWQ6ICcnLFxuICAgIG5vdGlmaWNhdGlvbnM6IHsgbGFzdF9wYWNrZXRfaWQ6ICcnLCBtb3ZlX25icjogJycgfSxcbiAgICBwbGF5ZXJvcmRlcjogW10sXG4gICAgcGxheWVyczoge30sXG4gICAgdGFibGVzcGVlZDogJycsXG4gIH07XG4gIHByaXZhdGUgcGxheWVyX2lkOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBwbGF5ZXJzOiB7IFtwbGF5ZXJJZDogbnVtYmVyXTogUGxheWVyIH0gPSBbXTtcbiAgcHJpdmF0ZSBwbGF5ZXJOdW1iZXI6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaGFuZENvdW50ZXJzOiB7IFtwbGF5ZXJJRDogc3RyaW5nXTogQ291bnRlciB9ID0ge307XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc29sZS5sb2coJ3Z1Z2hleCBjb25zdHJ1Y3RvcicpO1xuXG4gICAgLy8gSGVyZSwgeW91IGNhbiBpbml0IHRoZSBnbG9iYWwgdmFyaWFibGVzIG9mIHlvdXIgdXNlciBpbnRlcmZhY2VcbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIHRoaXMubXlHbG9iYWxWYWx1ZSA9IDA7XG4gIH1cblxuICAvKlxuICAgICAgICAgICAgc2V0dXA6XG5cbiAgICAgICAgICAgIFRoaXMgbWV0aG9kIG11c3Qgc2V0IHVwIHRoZSBnYW1lIHVzZXIgaW50ZXJmYWNlIGFjY29yZGluZyB0byBjdXJyZW50IGdhbWUgc2l0dWF0aW9uIHNwZWNpZmllZFxuICAgICAgICAgICAgaW4gcGFyYW1ldGVycy5cblxuICAgICAgICAgICAgVGhlIG1ldGhvZCBpcyBjYWxsZWQgZWFjaCB0aW1lIHRoZSBnYW1lIGludGVyZmFjZSBpcyBkaXNwbGF5ZWQgdG8gYSBwbGF5ZXIsIGllOlxuICAgICAgICAgICAgXyB3aGVuIHRoZSBnYW1lIHN0YXJ0c1xuICAgICAgICAgICAgXyB3aGVuIGEgcGxheWVyIHJlZnJlc2hlcyB0aGUgZ2FtZSBwYWdlIChGNSlcblxuICAgICAgICAgICAgXCJnYW1lZGF0YXNcIiBhcmd1bWVudCBjb250YWlucyBhbGwgZGF0YXMgcmV0cmlldmVkIGJ5IHlvdXIgXCJnZXRBbGxEYXRhc1wiIFBIUCBtZXRob2QuXG4gICAgICAgICovXG5cbiAgcHVibGljIHNldHVwKGdhbWVkYXRhczogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIGdhbWUgc2V0dXAnKTtcblxuICAgIC8vIFNldHRpbmcgdXAgcGxheWVyIGJvYXJkc1xuICAgIGZvciAobGV0IHBsYXllcl9pZCBpbiBnYW1lZGF0YXMucGxheWVycykge1xuICAgICAgY29uc3QgcGxheWVyID0gZ2FtZWRhdGFzLnBsYXllcnNbcGxheWVyX2lkXTtcblxuICAgICAgLy8gVE9ETzogU2V0dGluZyB1cCBwbGF5ZXJzIGJvYXJkcyBpZiBuZWVkZWRcblxuICAgICAgLy8gY3JlYXRlIGhhbmRzaXplIGNvdW50ZXIgcGVyIHBsYXllclxuICAgICAgLy8gY29uc3QgZWxtUGIgPSAkKGBwbGF5ZXJfYm9hcmRfJHtwbGF5ZXJfaWR9YCk7XG4gICAgICAvLyBkb2pvLnBsYWNlKFxuICAgICAgLy8gICAgIHRoaXMuZm9ybWF0X2Jsb2NrKCdqc3RwbF9wbGF5ZXJfYm9hcmQnLCBwbGF5ZXIpLCBlbG1QYik7XG4gICAgICAvLyB0aGlzLmhhbmRDb3VudGVyc1twbGF5ZXJfaWRdID0gbmV3IGViZy5jb3VudGVyKCk7XG4gICAgICAvLyB0aGlzLmhhbmRDb3VudGVyc1twbGF5ZXJfaWRdLmNyZWF0ZShgaGFuZC1jb3VudF9wJHtwbGF5ZXJfaWR9YCk7XG4gICAgICAvLyB0aGlzLmhhbmRDb3VudGVyc1twbGF5ZXJfaWRdLnNldFZhbHVlKHBsYXllci5jYXJkcyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogU2V0IHVwIHlvdXIgZ2FtZSBpbnRlcmZhY2UgaGVyZSwgYWNjb3JkaW5nIHRvIFwiZ2FtZWRhdGFzXCJcblxuICAgIC8vIFNldHVwIGdhbWUgbm90aWZpY2F0aW9ucyB0byBoYW5kbGUgKHNlZSBcInNldHVwTm90aWZpY2F0aW9uc1wiIG1ldGhvZCBiZWxvdylcbiAgICB0aGlzLnNldHVwTm90aWZpY2F0aW9ucygpO1xuXG4gICAgY29uc29sZS5sb2coJ0VuZGluZyBnYW1lIHNldHVwJyk7XG4gIH1cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLyBHYW1lICYgY2xpZW50IHN0YXRlc1xuXG4gIC8vIG9uRW50ZXJpbmdTdGF0ZTogdGhpcyBtZXRob2QgaXMgY2FsbGVkIGVhY2ggdGltZSB3ZSBhcmUgZW50ZXJpbmcgaW50byBhIG5ldyBnYW1lIHN0YXRlLlxuICAvLyAgICAgICAgICAgICAgICAgIFlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIHBlcmZvcm0gc29tZSB1c2VyIGludGVyZmFjZSBjaGFuZ2VzIGF0IHRoaXMgbW9tZW50LlxuICAvL1xuICBwdWJsaWMgb25FbnRlcmluZ1N0YXRlKHN0YXRlTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZygnRW50ZXJpbmcgc3RhdGU6ICcgKyBzdGF0ZU5hbWUpO1xuXG4gICAgc3dpdGNoIChzdGF0ZU5hbWUpIHtcbiAgICAgIC8qIEV4YW1wbGU6XG5cbiAgICAgICAgY2FzZSAnbXlHYW1lU3RhdGUnOlxuXG4gICAgICAgICAgICAvLyBTaG93IHNvbWUgSFRNTCBibG9jayBhdCB0aGlzIGdhbWUgc3RhdGVcbiAgICAgICAgICAgIGRvam8uc3R5bGUoICdteV9odG1sX2Jsb2NrX2lkJywgJ2Rpc3BsYXknLCAnYmxvY2snICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAqL1xuXG4gICAgICBjYXNlICdkdW1tbXknOlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBvbkxlYXZpbmdTdGF0ZTogdGhpcyBtZXRob2QgaXMgY2FsbGVkIGVhY2ggdGltZSB3ZSBhcmUgbGVhdmluZyBhIGdhbWUgc3RhdGUuXG4gIC8vICAgICAgICAgICAgICAgICBZb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byBwZXJmb3JtIHNvbWUgdXNlciBpbnRlcmZhY2UgY2hhbmdlcyBhdCB0aGlzIG1vbWVudC5cbiAgLy9cbiAgcHVibGljIG9uTGVhdmluZ1N0YXRlKHN0YXRlTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coJ0xlYXZpbmcgc3RhdGU6ICcgKyBzdGF0ZU5hbWUpO1xuXG4gICAgc3dpdGNoIChzdGF0ZU5hbWUpIHtcbiAgICAgIC8qIEV4YW1wbGU6XG5cbiAgICAgICAgY2FzZSAnbXlHYW1lU3RhdGUnOlxuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBIVE1MIGJsb2NrIHdlIGFyZSBkaXNwbGF5aW5nIG9ubHkgZHVyaW5nIHRoaXMgZ2FtZSBzdGF0ZVxuICAgICAgICAgICAgZG9qby5zdHlsZSggJ215X2h0bWxfYmxvY2tfaWQnLCAnZGlzcGxheScsICdub25lJyApO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgKi9cblxuICAgICAgY2FzZSAnZHVtbW15JzpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gb25VcGRhdGVBY3Rpb25CdXR0b25zOiBpbiB0aGlzIG1ldGhvZCB5b3UgY2FuIG1hbmFnZSBcImFjdGlvbiBidXR0b25zXCIgdGhhdCBhcmUgZGlzcGxheWVkIGluIHRoZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbiBzdGF0dXMgYmFyIChpZTogdGhlIEhUTUwgbGlua3MgaW4gdGhlIHN0YXR1cyBiYXIpLlxuICAvL1xuICBwdWJsaWMgb25VcGRhdGVBY3Rpb25CdXR0b25zKHN0YXRlTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZygnb25VcGRhdGVBY3Rpb25CdXR0b25zOiAnICsgc3RhdGVOYW1lKTtcblxuICAgIGlmICgodGhpcyBhcyBhbnkpLmlzQ3VycmVudFBsYXllckFjdGl2ZSgpKSB7XG4gICAgICBzd2l0Y2ggKFxuICAgICAgICBzdGF0ZU5hbWVcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICBFeGFtcGxlOlxuXG4gICAgICAgICAgICAgICAgY2FzZSAnbXlHYW1lU3RhdGUnOlxuXG4gICAgICAgICAgICAgICAgLy8gQWRkIDMgYWN0aW9uIGJ1dHRvbnMgaW4gdGhlIGFjdGlvbiBzdGF0dXMgYmFyOlxuXG4gICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5hZGRBY3Rpb25CdXR0b24oICdidXR0b25fMV9pZCcsIF8oJ0J1dHRvbiAxIGxhYmVsJyksICdvbk15TWV0aG9kVG9DYWxsMScgKTtcbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpLmFkZEFjdGlvbkJ1dHRvbiggJ2J1dHRvbl8yX2lkJywgXygnQnV0dG9uIDIgbGFiZWwnKSwgJ29uTXlNZXRob2RUb0NhbGwyJyApO1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSkuYWRkQWN0aW9uQnV0dG9uKCAnYnV0dG9uXzNfaWQnLCBfKCdCdXR0b24gMyBsYWJlbCcpLCAnb25NeU1ldGhvZFRvQ2FsbDMnICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4qL1xuICAgICAgKSB7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8gVXRpbGl0eSBtZXRob2RzXG5cbiAgLypcblxuICAgICAgICBIZXJlLCB5b3UgY2FuIGRlZmluZXMgc29tZSB1dGlsaXR5IG1ldGhvZHMgdGhhdCB5b3UgY2FuIHVzZSBldmVyeXdoZXJlIGluIHlvdXIgamF2YXNjcmlwdFxuICAgICAgICBzY3JpcHQuXG5cbiAgICAqL1xuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vIFBsYXllcidzIGFjdGlvblxuXG4gIC8qXG5cbiAgICAgICAgSGVyZSwgeW91IGFyZSBkZWZpbmluZyBtZXRob2RzIHRvIGhhbmRsZSBwbGF5ZXIncyBhY3Rpb24gKGV4OiByZXN1bHRzIG9mIG1vdXNlIGNsaWNrIG9uXG4gICAgICAgIGdhbWUgb2JqZWN0cykuXG5cbiAgICAgICAgTW9zdCBvZiB0aGUgdGltZSwgdGhlc2UgbWV0aG9kczpcbiAgICAgICAgXyBjaGVjayB0aGUgYWN0aW9uIGlzIHBvc3NpYmxlIGF0IHRoaXMgZ2FtZSBzdGF0ZS5cbiAgICAgICAgXyBtYWtlIGEgY2FsbCB0byB0aGUgZ2FtZSBzZXJ2ZXJcblxuICAgICovXG5cbiAgLyogRXhhbXBsZTpcblxuICAgIG9uTXlNZXRob2RUb0NhbGwxKCBldnQgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnb25NeU1ldGhvZFRvQ2FsbDEnICk7XG5cbiAgICAgICAgLy8gUHJldmVudGluZyBkZWZhdWx0IGJyb3dzZXIgcmVhY3Rpb25cbiAgICAgICAgZG9qby5zdG9wRXZlbnQoIGV2dCApO1xuXG4gICAgICAgIC8vIENoZWNrIHRoYXQgdGhpcyBhY3Rpb24gaXMgcG9zc2libGUgKHNlZSBcInBvc3NpYmxlYWN0aW9uc1wiIGluIHN0YXRlcy5pbmMucGhwKVxuICAgICAgICBpZiggISB0aGlzLmNoZWNrQWN0aW9uKCAnbXlBY3Rpb24nICkgKVxuICAgICAgICB7ICAgcmV0dXJuOyB9XG5cbiAgICAgICAgdGhpcy5hamF4Y2FsbCggXCIvdnVnaGV4L3Z1Z2hleC9teUFjdGlvbi5odG1sXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NrOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15QXJndW1lbnQxOiBhcmcxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15QXJndW1lbnQyOiBhcmcyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLCByZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGF0IHRvIGRvIGFmdGVyIHRoZSBzZXJ2ZXIgY2FsbCBpZiBpdCBzdWNjZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChtb3N0IG9mIHRoZSB0aW1lOiBub3RoaW5nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBpc19lcnJvciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoYXQgdG8gZG8gYWZ0ZXIgdGhlIHNlcnZlciBjYWxsIGluIGFueXdheSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gKG1vc3Qgb2YgdGhlIHRpbWU6IG5vdGhpbmcpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICB9LFxuXG4gICAgKi9cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLyBSZWFjdGlvbiB0byBjb21ldEQgbm90aWZpY2F0aW9uc1xuXG4gIC8qXG4gICAgICAgIHNldHVwTm90aWZpY2F0aW9uczpcblxuICAgICAgICBJbiB0aGlzIG1ldGhvZCwgeW91IGFzc29jaWF0ZSBlYWNoIG9mIHlvdXIgZ2FtZSBub3RpZmljYXRpb25zIHdpdGggeW91ciBsb2NhbCBtZXRob2QgdG8gaGFuZGxlIGl0LlxuXG4gICAgICAgIE5vdGU6IGdhbWUgbm90aWZpY2F0aW9uIG5hbWVzIGNvcnJlc3BvbmQgdG8gXCJub3RpZnlBbGxQbGF5ZXJzXCIgYW5kIFwibm90aWZ5UGxheWVyXCIgY2FsbHMgaW5cbiAgICAgICAgICAgICAgICB5b3VyIHZ1Z2hleC5nYW1lLnBocCBmaWxlLlxuXG4gICAgKi9cbiAgc2V0dXBOb3RpZmljYXRpb25zKCkge1xuICAgIGNvbnNvbGUubG9nKCdub3RpZmljYXRpb25zIHN1YnNjcmlwdGlvbnMgc2V0dXAnKTtcblxuICAgIC8vIFRPRE86IGhlcmUsIGFzc29jaWF0ZSB5b3VyIGdhbWUgbm90aWZpY2F0aW9ucyB3aXRoIGxvY2FsIG1ldGhvZHNcblxuICAgIC8vIEV4YW1wbGUgMTogc3RhbmRhcmQgbm90aWZpY2F0aW9uIGhhbmRsaW5nXG4gICAgLy8gZG9qby5zdWJzY3JpYmUoICdjYXJkUGxheWVkJywgdGhpcywgXCJub3RpZl9jYXJkUGxheWVkXCIgKTtcblxuICAgIC8vIEV4YW1wbGUgMjogc3RhbmRhcmQgbm90aWZpY2F0aW9uIGhhbmRsaW5nICsgdGVsbCB0aGUgdXNlciBpbnRlcmZhY2UgdG8gd2FpdFxuICAgIC8vICAgICAgICAgICAgZHVyaW5nIDMgc2Vjb25kcyBhZnRlciBjYWxsaW5nIHRoZSBtZXRob2QgaW4gb3JkZXIgdG8gbGV0IHRoZSBwbGF5ZXJzXG4gICAgLy8gICAgICAgICAgICBzZWUgd2hhdCBpcyBoYXBwZW5pbmcgaW4gdGhlIGdhbWUuXG4gICAgLy8gZG9qby5zdWJzY3JpYmUoICdjYXJkUGxheWVkJywgdGhpcywgXCJub3RpZl9jYXJkUGxheWVkXCIgKTtcbiAgICAvLyB0aGlzLm5vdGlmcXVldWUuc2V0U3luY2hyb25vdXMoICdjYXJkUGxheWVkJywgMzAwMCApO1xuICAgIC8vXG4gIH1cblxuICAvLyBUT0RPOiBmcm9tIHRoaXMgcG9pbnQgYW5kIGJlbG93LCB5b3UgY2FuIHdyaXRlIHlvdXIgZ2FtZSBub3RpZmljYXRpb25zIGhhbmRsaW5nIG1ldGhvZHNcblxuICAvKlxuICAgIEV4YW1wbGU6XG5cbiAgICBub3RpZl9jYXJkUGxheWVkKCBub3RpZiApIHtcbiAgICAgICAgY29uc29sZS5sb2coICdub3RpZl9jYXJkUGxheWVkJyApO1xuICAgICAgICBjb25zb2xlLmxvZyggbm90aWYgKTtcblxuICAgICAgICAvLyBOb3RlOiBub3RpZi5hcmdzIGNvbnRhaW5zIHRoZSBhcmd1bWVudHMgc3BlY2lmaWVkIGR1cmluZyB5b3UgXCJub3RpZnlBbGxQbGF5ZXJzXCIgLyBcIm5vdGlmeVBsYXllclwiIFBIUCBjYWxsXG5cbiAgICAgICAgLy8gVE9ETzogcGxheSB0aGUgY2FyZCBpbiB0aGUgdXNlciBpbnRlcmZhY2UuXG4gICAgfSxcblxuICAgICovXG59XG5cbmRlZmluZShbXG4gICAgJ2Rvam8nLFxuICAgICdkb2pvL19iYXNlL2RlY2xhcmUnLFxuICAgICdlYmcvY29yZS9nYW1lZ3VpJyxcbiAgICAnZWJnL2NvdW50ZXInLFxuICAgICdlYmcvc3RvY2snLFxuICAgIGdfZ2FtZXRoZW1ldXJsICsgXCJtb2R1bGVzL2NodW5rLXZlbmRvcnMuanNcIixcbiAgICBnX2dhbWV0aGVtZXVybCArIFwibW9kdWxlcy9hcHAuanNcIlxuXSwgZnVuY3Rpb24gKGRvam86IERvam8sIGRlY2xhcmU6IGFueSkge1xuICAgIHJldHVybiBkZWNsYXJlKCdiZ2FnYW1lLnZ1Z2hleCcsIGViZy5jb3JlLmdhbWVndWksIG5ldyBWdWdoZXgoKSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==