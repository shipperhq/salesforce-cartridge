'use strict';

function getLogger() {
    return {
        error: ''
    };
}

function error() {
    return 'message';
}

module.exports = {
    getLogger: getLogger,
    error: error
};
