/**
 * Module Dependencies
 */
var winston = require('winston');
var _ = require('lodash');

/**
 * Initialize a new `Application`.
 *
 * @api public
 */

function Logger(namespace) {
  "use strict";
  if (!(this instanceof Logger)) {
    return new Logger(namespace);
  }

  if (typeof namespace === 'undefined') {
    namespace = 'app';
  }

  if (typeof loggers[namespace] !== 'undefined') {
    return loggers[namespace];
  }

  this.namespace = namespace;

  Logger.addNamespace(namespace, this);

  setUpLogger();

  this.log = this.log.bind(this);
}

Logger.prototype.log = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.namespace);

  logger.log.apply(logger, args);
};

/**
 * Private Variables
 */
var logger = null;
var transports = [
  new (winston.transports.Console)({
    colorize: true,
    prettyPrint: true
  })
];
var loggers = {};
var lastIndex = 0;
var colors = [
  'cyan',
  'green',
  'blue',
  'magenta',
  'yellow',
  'red'
];
var maxLevel = -1;
var firstNamespace = '';
var logLevels = {};
var logColors = {};

function setUpLogger() {
  logger = new (winston.Logger)({
    transports: transports,
    levels: logLevels,
    colors: logColors
  });

  logger.level = firstNamespace;

  _.each(logger.transports, function(transport) {
    transport.level = firstNamespace;
  });
}

Logger.addTransport = function(transport) {
  transports.push(transport);
  setUpLogger();
};

Logger.addNamespace = function(namespace, logger) {
  loggers[namespace] = logger;
  logLevels[namespace] = ++maxLevel;
  logColors[namespace] = colors[lastIndex++];
  if (firstNamespace == '') {
    firstNamespace = namespace;
  }

  if (lastIndex > colors.length) {
    lastIndex = 0;
  }
};

/**
 * Expose `Application`
 */

exports = module.exports = Logger;
