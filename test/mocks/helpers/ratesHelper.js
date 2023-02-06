'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

// ////
var Logger = require('../../mocks/dw/Logger');
var ShipperHQ = require('../../mocks/scripts/rest');
var formatting = require('../../mocks/util/formatting');
var requestHelper = require('./requestHelper');
var cacheHelper = require('./cacheHelper');
// ////

var Configuration = require('../../mocks/scripts/configuration');

function proxyModel() {
    return proxyquire('../../../cartridges/int_shipperhq_sfra/cartridge/scripts/helpers/ratesHelper', {
        '*/cartridge/scripts/helpers/requestHelper': requestHelper,
        '*/cartridge/scripts/services/rest': ShipperHQ,
        'dw/system/Logger': Logger,
        '*/cartridge/scripts/helpers/cacheHelper': cacheHelper,
        '*/cartridge/scripts/configuration': Configuration,
        '*/cartridge/scripts/util/formatting': formatting
    });
}

module.exports = proxyModel();
