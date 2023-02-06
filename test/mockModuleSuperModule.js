'use strict';

/**
 * Create a mock module.superModule
 */

 // used for storing original value of superModule
var originalValue;

function create(mock) {
    var moduleProto = Object.getPrototypeOf(module);  // eslint no-proto deprecation had to use this
    originalValue = moduleProto.superModule;          // original value holds undefined so can revert back to after
    moduleProto.superModule = mock;
}

/**
 * Delete the mock module.superModule
 */
function remove() {
    var moduleProto = Object.getPrototypeOf(module);
    moduleProto.superModule = originalValue;     // returns module to inital state
}

module.exports = {
    create: create,
    remove: remove
};
