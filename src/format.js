var Player = require('./class/player');

const baseURL = 'https://api.playbattlegrounds.com/shards/';

/**
 * Formats a player JSON string object to a Player object.
 * 
 * @param {object} data 
 * @param {function(Player)} done
 */
exports.player = (data, done) => {
  var player = new Player(data);
  done(player);
};

/**
 * Formtas a player JSON string array object to a Player[].
 * 
 * @param {object} data 
 * @param {function(Player[])} done 
 */
exports.players = (data, done) => {
  var players = data.map(n => new Player(n));
  done(players);
};

/**
 * Formats the full URI from the Platform Region and endpoint.
 * 
 * @param {string} platformRegion 
 * @param {string} endpoint 
 */
exports.fullURI = (platformRegion, endpoint) => {
  return baseURL + platformRegion + endpoint;
};

/**
 * Formats API HTTP errors.
 * 
 * @param {number} statusCode 
 * @param {object} error 
 * @param {function(Error)} done 
 */
exports.error = (statusCode, error, done) => {
  var message =
    statusCode === 429
      ? 'Too many requests'
      : error.title;
  var detail =
    error.detail
      ? error.detail
      : '';

  error = new Error(message);
  error.statusCode = statusCode;
  error.detail = detail;
  done(error);
};

/**
 * Formats the Players endpoint.
 * Defaults to the empty string if no ids or names are provided.
 * 
 * @param {string[]} ids 
 * @param {string[]} names 
 */
exports.playersEndpoint = (ids, names, done) => {
  if(ids) {
    // IDs
    var idList = ids.join(',');
    var idFilter = '?filter[playerIds]=';
    if (names) {
      // IDs and Names
      var nameList = names.join(',');

      done(idFilter + idList + '&filter[playerNames]=' + nameList);
    } else {
      // IDs only
      done(idFilter + idList);
    }

  } else if (names) {
    // Names only
    var onlyNameList = names.join(',');
    done('?filter[playerNames]=' + onlyNameList);
  } else {
    // No filter
    done('');
  }
};