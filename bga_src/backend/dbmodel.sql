
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Vughex implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
--
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

-- CREATE TABLE IF NOT EXISTS `card` (
--   `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `card_type` varchar(16) NOT NULL,
--   `card_type_arg` int(11) NOT NULL,
--   `card_location` varchar(16) NOT NULL,
--   `card_location_arg` int(11) NOT NULL,
--   PRIMARY KEY (`card_id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- Example 2: add a custom field to the standard "player" table
-- ALTER TABLE `player` ADD `player_my_custom_field` INT UNSIGNED NOT NULL DEFAULT '0';

CREATE TABLE IF NOT EXISTS `cards` (
  `card_id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` TINYINT UNSIGNED NOT NULL,
  `card_location` VARCHAR(16) NOT NULL,
  `card_location_arg` int(11),
  `card_meta` VARCHAR(16)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `center` (
  `center_id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `center_location` varchar(10) NOT NULL,
  `center_controller` int(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `round` (
  `round_id` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `round_side` varchar(10) NOT NULL,
  `round_num` INT(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `reincarnation` (
  `reincarnation_card_id` INT(10) UNSIGNED,
  `reincarnation_col` INT(10) UNSIGNED,
  `reincarnation_current_player` INT(10) UNSIGNED,
  `reincarnation_next_player` INT(10) UNSIGNED
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `score` (
  `score_round` INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `score_center_list` VARCHAR(18),
  `score_sun_list` VARCHAR(18),
  `score_night_list` VARCHAR(18),
  `score_winner` VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- ALTER TABLE `player` ADD `player_side` VARCHAR(16);
