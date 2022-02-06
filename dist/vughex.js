/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ./src/vughex.ts ***!
  \***********************/

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
exports.__esModule = true;
exports.Vughex = void 0;
var Vughex = /** @class */ (function () {
    function Vughex() {
        this.gamedatas = {
            current_player_id: '',
            decision: { decision_type: '' },
            game_result_neutralized: '',
            gamestate: null,
            gamestates: {},
            neutralized_player_id: '',
            notifications: { last_packet_id: '', move_nbr: '' },
            playerorder: [],
            players: {},
            tablespeed: ''
        };
        this.player_id = '';
        this.players = [];
        this.playerNumber = 0;
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
    Vughex.prototype.setup = function (gamedatas) {
        console.log('Starting game setup');
        // Setting up player boards
        for (var player_id in gamedatas.players) {
            var player = gamedatas.players[player_id];
            // TODO: Setting up players boards if needed
        }
        // TODO: Set up your game interface here, according to "gamedatas"
        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();
        console.log('Ending game setup');
    };
    ///////////////////////////////////////////////////
    //// Game & client states
    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    Vughex.prototype.onEnteringState = function (stateName, args) {
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
    };
    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    Vughex.prototype.onLeavingState = function (stateName) {
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
    };
    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    Vughex.prototype.onUpdateActionButtons = function (stateName, args) {
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
    };
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
    Vughex.prototype.setupNotifications = function () {
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
    };
    return Vughex;
}());
exports.Vughex = Vughex;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVnaGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0EsNkJBQTZCLGtDQUFrQztBQUMvRDtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7O0FBRUE7QUFDQTs7QUFFQSx5QkFBeUI7O0FBRXpCO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsY0FBYyIsInNvdXJjZXMiOlsid2VicGFjazovL3Z1Z2hleC8uL3NyYy92dWdoZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqLS0tLS0tXG4gKiBCR0EgZnJhbWV3b3JrOiDCqSBHcmVnb3J5IElzYWJlbGxpIDxnaXNhYmVsbGlAYm9hcmRnYW1lYXJlbmEuY29tPiAmIEVtbWFudWVsIENvbGluIDxlY29saW5AYm9hcmRnYW1lYXJlbmEuY29tPlxuICogVnVnaGV4IGltcGxlbWVudGF0aW9uIDogwqkgVG9tb2tpIE1vdG9oYXNoaSA8dG9tb2tpLm1vdG9oYXNoaUB0YWtvYXNoaS5jb20+XG4gKlxuICogVGhpcyBjb2RlIGhhcyBiZWVuIHByb2R1Y2VkIG9uIHRoZSBCR0Egc3R1ZGlvIHBsYXRmb3JtIGZvciB1c2Ugb24gaHR0cDovL2JvYXJkZ2FtZWFyZW5hLmNvbS5cbiAqIFNlZSBodHRwOi8vZW4uYm9hcmRnYW1lYXJlbmEuY29tLyMhZG9jL1N0dWRpbyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqIC0tLS0tXG4gKlxuICogdnVnaGV4LnRzXG4gKlxuICogWW91ckdhbWVOYW1lIHVzZXIgaW50ZXJmYWNlIHNjcmlwdFxuICpcbiAqIEluIHRoaXMgZmlsZSwgeW91IGFyZSBkZXNjcmliaW5nIHRoZSBsb2dpYyBvZiB5b3VyIHVzZXIgaW50ZXJmYWNlLCBpbiBUeXBlc2NyaXB0IGxhbmd1YWdlLlxuICpcbiAqL1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVnVnaGV4ID0gdm9pZCAwO1xudmFyIFZ1Z2hleCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWdWdoZXgoKSB7XG4gICAgICAgIHRoaXMuZ2FtZWRhdGFzID0ge1xuICAgICAgICAgICAgY3VycmVudF9wbGF5ZXJfaWQ6ICcnLFxuICAgICAgICAgICAgZGVjaXNpb246IHsgZGVjaXNpb25fdHlwZTogJycgfSxcbiAgICAgICAgICAgIGdhbWVfcmVzdWx0X25ldXRyYWxpemVkOiAnJyxcbiAgICAgICAgICAgIGdhbWVzdGF0ZTogbnVsbCxcbiAgICAgICAgICAgIGdhbWVzdGF0ZXM6IHt9LFxuICAgICAgICAgICAgbmV1dHJhbGl6ZWRfcGxheWVyX2lkOiAnJyxcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbnM6IHsgbGFzdF9wYWNrZXRfaWQ6ICcnLCBtb3ZlX25icjogJycgfSxcbiAgICAgICAgICAgIHBsYXllcm9yZGVyOiBbXSxcbiAgICAgICAgICAgIHBsYXllcnM6IHt9LFxuICAgICAgICAgICAgdGFibGVzcGVlZDogJydcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wbGF5ZXJfaWQgPSAnJztcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XG4gICAgICAgIHRoaXMucGxheWVyTnVtYmVyID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coJ3Z1Z2hleCBjb25zdHJ1Y3RvcicpO1xuICAgICAgICAvLyBIZXJlLCB5b3UgY2FuIGluaXQgdGhlIGdsb2JhbCB2YXJpYWJsZXMgb2YgeW91ciB1c2VyIGludGVyZmFjZVxuICAgICAgICAvLyBFeGFtcGxlOlxuICAgICAgICAvLyB0aGlzLm15R2xvYmFsVmFsdWUgPSAwO1xuICAgIH1cbiAgICAvKlxuICAgICAgICAgICAgc2V0dXA6XG5cbiAgICAgICAgICAgIFRoaXMgbWV0aG9kIG11c3Qgc2V0IHVwIHRoZSBnYW1lIHVzZXIgaW50ZXJmYWNlIGFjY29yZGluZyB0byBjdXJyZW50IGdhbWUgc2l0dWF0aW9uIHNwZWNpZmllZFxuICAgICAgICAgICAgaW4gcGFyYW1ldGVycy5cblxuICAgICAgICAgICAgVGhlIG1ldGhvZCBpcyBjYWxsZWQgZWFjaCB0aW1lIHRoZSBnYW1lIGludGVyZmFjZSBpcyBkaXNwbGF5ZWQgdG8gYSBwbGF5ZXIsIGllOlxuICAgICAgICAgICAgXyB3aGVuIHRoZSBnYW1lIHN0YXJ0c1xuICAgICAgICAgICAgXyB3aGVuIGEgcGxheWVyIHJlZnJlc2hlcyB0aGUgZ2FtZSBwYWdlIChGNSlcblxuICAgICAgICAgICAgXCJnYW1lZGF0YXNcIiBhcmd1bWVudCBjb250YWlucyBhbGwgZGF0YXMgcmV0cmlldmVkIGJ5IHlvdXIgXCJnZXRBbGxEYXRhc1wiIFBIUCBtZXRob2QuXG4gICAgICAgICovXG4gICAgVnVnaGV4LnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uIChnYW1lZGF0YXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIGdhbWUgc2V0dXAnKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBwbGF5ZXIgYm9hcmRzXG4gICAgICAgIGZvciAodmFyIHBsYXllcl9pZCBpbiBnYW1lZGF0YXMucGxheWVycykge1xuICAgICAgICAgICAgdmFyIHBsYXllciA9IGdhbWVkYXRhcy5wbGF5ZXJzW3BsYXllcl9pZF07XG4gICAgICAgICAgICAvLyBUT0RPOiBTZXR0aW5nIHVwIHBsYXllcnMgYm9hcmRzIGlmIG5lZWRlZFxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IFNldCB1cCB5b3VyIGdhbWUgaW50ZXJmYWNlIGhlcmUsIGFjY29yZGluZyB0byBcImdhbWVkYXRhc1wiXG4gICAgICAgIC8vIFNldHVwIGdhbWUgbm90aWZpY2F0aW9ucyB0byBoYW5kbGUgKHNlZSBcInNldHVwTm90aWZpY2F0aW9uc1wiIG1ldGhvZCBiZWxvdylcbiAgICAgICAgdGhpcy5zZXR1cE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0VuZGluZyBnYW1lIHNldHVwJyk7XG4gICAgfTtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vIEdhbWUgJiBjbGllbnQgc3RhdGVzXG4gICAgLy8gb25FbnRlcmluZ1N0YXRlOiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgZWFjaCB0aW1lIHdlIGFyZSBlbnRlcmluZyBpbnRvIGEgbmV3IGdhbWUgc3RhdGUuXG4gICAgLy8gICAgICAgICAgICAgICAgICBZb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byBwZXJmb3JtIHNvbWUgdXNlciBpbnRlcmZhY2UgY2hhbmdlcyBhdCB0aGlzIG1vbWVudC5cbiAgICAvL1xuICAgIFZ1Z2hleC5wcm90b3R5cGUub25FbnRlcmluZ1N0YXRlID0gZnVuY3Rpb24gKHN0YXRlTmFtZSwgYXJncykge1xuICAgICAgICBjb25zb2xlLmxvZygnRW50ZXJpbmcgc3RhdGU6ICcgKyBzdGF0ZU5hbWUpO1xuICAgICAgICBzd2l0Y2ggKHN0YXRlTmFtZSkge1xuICAgICAgICAgICAgLyogRXhhbXBsZTpcblxuICAgICAgICBjYXNlICdteUdhbWVTdGF0ZSc6XG5cbiAgICAgICAgICAgIC8vIFNob3cgc29tZSBIVE1MIGJsb2NrIGF0IHRoaXMgZ2FtZSBzdGF0ZVxuICAgICAgICAgICAgZG9qby5zdHlsZSggJ215X2h0bWxfYmxvY2tfaWQnLCAnZGlzcGxheScsICdibG9jaycgKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICovXG4gICAgICAgICAgICBjYXNlICdkdW1tbXknOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBvbkxlYXZpbmdTdGF0ZTogdGhpcyBtZXRob2QgaXMgY2FsbGVkIGVhY2ggdGltZSB3ZSBhcmUgbGVhdmluZyBhIGdhbWUgc3RhdGUuXG4gICAgLy8gICAgICAgICAgICAgICAgIFlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIHBlcmZvcm0gc29tZSB1c2VyIGludGVyZmFjZSBjaGFuZ2VzIGF0IHRoaXMgbW9tZW50LlxuICAgIC8vXG4gICAgVnVnaGV4LnByb3RvdHlwZS5vbkxlYXZpbmdTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZU5hbWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xlYXZpbmcgc3RhdGU6ICcgKyBzdGF0ZU5hbWUpO1xuICAgICAgICBzd2l0Y2ggKHN0YXRlTmFtZSkge1xuICAgICAgICAgICAgLyogRXhhbXBsZTpcblxuICAgICAgICBjYXNlICdteUdhbWVTdGF0ZSc6XG5cbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIEhUTUwgYmxvY2sgd2UgYXJlIGRpc3BsYXlpbmcgb25seSBkdXJpbmcgdGhpcyBnYW1lIHN0YXRlXG4gICAgICAgICAgICBkb2pvLnN0eWxlKCAnbXlfaHRtbF9ibG9ja19pZCcsICdkaXNwbGF5JywgJ25vbmUnICk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAqL1xuICAgICAgICAgICAgY2FzZSAnZHVtbW15JzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gb25VcGRhdGVBY3Rpb25CdXR0b25zOiBpbiB0aGlzIG1ldGhvZCB5b3UgY2FuIG1hbmFnZSBcImFjdGlvbiBidXR0b25zXCIgdGhhdCBhcmUgZGlzcGxheWVkIGluIHRoZVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uIHN0YXR1cyBiYXIgKGllOiB0aGUgSFRNTCBsaW5rcyBpbiB0aGUgc3RhdHVzIGJhcikuXG4gICAgLy9cbiAgICBWdWdoZXgucHJvdG90eXBlLm9uVXBkYXRlQWN0aW9uQnV0dG9ucyA9IGZ1bmN0aW9uIChzdGF0ZU5hbWUsIGFyZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ29uVXBkYXRlQWN0aW9uQnV0dG9uczogJyArIHN0YXRlTmFtZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBsYXllckFjdGl2ZSgpKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlTmFtZVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIEV4YW1wbGU6XG5cbiAgICAgICAgICAgIGNhc2UgJ215R2FtZVN0YXRlJzpcblxuICAgICAgICAgICAgLy8gQWRkIDMgYWN0aW9uIGJ1dHRvbnMgaW4gdGhlIGFjdGlvbiBzdGF0dXMgYmFyOlxuXG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpLmFkZEFjdGlvbkJ1dHRvbiggJ2J1dHRvbl8xX2lkJywgXygnQnV0dG9uIDEgbGFiZWwnKSwgJ29uTXlNZXRob2RUb0NhbGwxJyApO1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5hZGRBY3Rpb25CdXR0b24oICdidXR0b25fMl9pZCcsIF8oJ0J1dHRvbiAyIGxhYmVsJyksICdvbk15TWV0aG9kVG9DYWxsMicgKTtcbiAgICAgICAgICAgICh0aGlzIGFzIGFueSkuYWRkQWN0aW9uQnV0dG9uKCAnYnV0dG9uXzNfaWQnLCBfKCdCdXR0b24gMyBsYWJlbCcpLCAnb25NeU1ldGhvZFRvQ2FsbDMnICk7XG4gICAgICAgICAgICBicmVhaztcbiovXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLyBVdGlsaXR5IG1ldGhvZHNcbiAgICAvKlxuXG4gICAgICAgIEhlcmUsIHlvdSBjYW4gZGVmaW5lcyBzb21lIHV0aWxpdHkgbWV0aG9kcyB0aGF0IHlvdSBjYW4gdXNlIGV2ZXJ5d2hlcmUgaW4geW91ciBqYXZhc2NyaXB0XG4gICAgICAgIHNjcmlwdC5cblxuICAgICovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLyBQbGF5ZXIncyBhY3Rpb25cbiAgICAvKlxuXG4gICAgICAgIEhlcmUsIHlvdSBhcmUgZGVmaW5pbmcgbWV0aG9kcyB0byBoYW5kbGUgcGxheWVyJ3MgYWN0aW9uIChleDogcmVzdWx0cyBvZiBtb3VzZSBjbGljayBvblxuICAgICAgICBnYW1lIG9iamVjdHMpLlxuXG4gICAgICAgIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZXNlIG1ldGhvZHM6XG4gICAgICAgIF8gY2hlY2sgdGhlIGFjdGlvbiBpcyBwb3NzaWJsZSBhdCB0aGlzIGdhbWUgc3RhdGUuXG4gICAgICAgIF8gbWFrZSBhIGNhbGwgdG8gdGhlIGdhbWUgc2VydmVyXG5cbiAgICAqL1xuICAgIC8qIEV4YW1wbGU6XG5cbiAgICBvbk15TWV0aG9kVG9DYWxsMSggZXZ0ICkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ29uTXlNZXRob2RUb0NhbGwxJyApO1xuXG4gICAgICAgIC8vIFByZXZlbnRpbmcgZGVmYXVsdCBicm93c2VyIHJlYWN0aW9uXG4gICAgICAgIGRvam8uc3RvcEV2ZW50KCBldnQgKTtcblxuICAgICAgICAvLyBDaGVjayB0aGF0IHRoaXMgYWN0aW9uIGlzIHBvc3NpYmxlIChzZWUgXCJwb3NzaWJsZWFjdGlvbnNcIiBpbiBzdGF0ZXMuaW5jLnBocClcbiAgICAgICAgaWYoICEgdGhpcy5jaGVja0FjdGlvbiggJ215QWN0aW9uJyApIClcbiAgICAgICAgeyAgIHJldHVybjsgfVxuXG4gICAgICAgIHRoaXMuYWpheGNhbGwoIFwiL3Z1Z2hleC92dWdoZXgvbXlBY3Rpb24uaHRtbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUFyZ3VtZW50MTogYXJnMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUFyZ3VtZW50MjogYXJnMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcywgcmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hhdCB0byBkbyBhZnRlciB0aGUgc2VydmVyIGNhbGwgaWYgaXQgc3VjY2VlZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAobW9zdCBvZiB0aGUgdGltZTogbm90aGluZylcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgaXNfZXJyb3IgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGF0IHRvIGRvIGFmdGVyIHRoZSBzZXJ2ZXIgY2FsbCBpbiBhbnl3YXkgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChtb3N0IG9mIHRoZSB0aW1lOiBub3RoaW5nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICk7XG4gICAgfSxcblxuICAgICovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLyBSZWFjdGlvbiB0byBjb21ldEQgbm90aWZpY2F0aW9uc1xuICAgIC8qXG4gICAgICAgIHNldHVwTm90aWZpY2F0aW9uczpcblxuICAgICAgICBJbiB0aGlzIG1ldGhvZCwgeW91IGFzc29jaWF0ZSBlYWNoIG9mIHlvdXIgZ2FtZSBub3RpZmljYXRpb25zIHdpdGggeW91ciBsb2NhbCBtZXRob2QgdG8gaGFuZGxlIGl0LlxuXG4gICAgICAgIE5vdGU6IGdhbWUgbm90aWZpY2F0aW9uIG5hbWVzIGNvcnJlc3BvbmQgdG8gXCJub3RpZnlBbGxQbGF5ZXJzXCIgYW5kIFwibm90aWZ5UGxheWVyXCIgY2FsbHMgaW5cbiAgICAgICAgICAgICAgICB5b3VyIHZ1Z2hleC5nYW1lLnBocCBmaWxlLlxuXG4gICAgKi9cbiAgICBWdWdoZXgucHJvdG90eXBlLnNldHVwTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25vdGlmaWNhdGlvbnMgc3Vic2NyaXB0aW9ucyBzZXR1cCcpO1xuICAgICAgICAvLyBUT0RPOiBoZXJlLCBhc3NvY2lhdGUgeW91ciBnYW1lIG5vdGlmaWNhdGlvbnMgd2l0aCBsb2NhbCBtZXRob2RzXG4gICAgICAgIC8vIEV4YW1wbGUgMTogc3RhbmRhcmQgbm90aWZpY2F0aW9uIGhhbmRsaW5nXG4gICAgICAgIC8vIGRvam8uc3Vic2NyaWJlKCAnY2FyZFBsYXllZCcsIHRoaXMsIFwibm90aWZfY2FyZFBsYXllZFwiICk7XG4gICAgICAgIC8vIEV4YW1wbGUgMjogc3RhbmRhcmQgbm90aWZpY2F0aW9uIGhhbmRsaW5nICsgdGVsbCB0aGUgdXNlciBpbnRlcmZhY2UgdG8gd2FpdFxuICAgICAgICAvLyAgICAgICAgICAgIGR1cmluZyAzIHNlY29uZHMgYWZ0ZXIgY2FsbGluZyB0aGUgbWV0aG9kIGluIG9yZGVyIHRvIGxldCB0aGUgcGxheWVyc1xuICAgICAgICAvLyAgICAgICAgICAgIHNlZSB3aGF0IGlzIGhhcHBlbmluZyBpbiB0aGUgZ2FtZS5cbiAgICAgICAgLy8gZG9qby5zdWJzY3JpYmUoICdjYXJkUGxheWVkJywgdGhpcywgXCJub3RpZl9jYXJkUGxheWVkXCIgKTtcbiAgICAgICAgLy8gdGhpcy5ub3RpZnF1ZXVlLnNldFN5bmNocm9ub3VzKCAnY2FyZFBsYXllZCcsIDMwMDAgKTtcbiAgICAgICAgLy9cbiAgICB9O1xuICAgIHJldHVybiBWdWdoZXg7XG59KCkpO1xuZXhwb3J0cy5WdWdoZXggPSBWdWdoZXg7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=