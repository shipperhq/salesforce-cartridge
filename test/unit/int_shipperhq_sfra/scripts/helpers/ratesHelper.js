'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

// ////
var Logger = require('../../../../mocks/dw/Logger');
var ShipperHQ = require('../../../../mocks/scripts/rest');
var formatting = require('../../../../mocks/util/formatting');
var requestHelper = require('../../../../mocks/helpers/requestHelper');
var cacheHelper = require('../../../../mocks/helpers/cacheHelper');
var builder = require('../../builder');
// ////

var Configuration = require('../../../../mocks/scripts/configuration');

var ratesHelper = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/helpers/ratesHelper', {
    '*/cartridge/scripts/helpers/requestHelper': requestHelper,
    '*/cartridge/scripts/services/rest': ShipperHQ,
    'dw/system/Logger': Logger,
    '*/cartridge/scripts/helpers/cacheHelper': cacheHelper,
    '*/cartridge/scripts/configuration': Configuration,
    '*/cartridge/scripts/util/formatting': formatting
});

// predefined customer info
function buildCustomer() {
    var customer = {
        customerGroups: [{ ID: 'guest' }, { ID: 'retail' }]
    };
    return customer;
}

describe('RatesHelper ShipperHQ', function () {
    describe('applyShippingRateData with cached ratesList', function () {
        // cacheHit = true

        it('should apply the rates the shippingMethodModel', function () {
            var shippingMethodModel = {
                ID: 'shqflat_fixed ',
                displayName: 'fixed',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethod(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'shqflat_fixed ');
            assert.equal(shippingMethodModel.shippingCost, '$35.22');
        });

        it('should not apply the rates the shippingMethodModel or even make call out, these would be previously defined methods before shq', function () {
            var shippingMethodModel = {
                ID: 'fixed',
                displayName: 'fixed',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethodSHQDisabled(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'fixed');
            assert.equal(shippingMethodModel.shippingCost, '$5.00');
        });

        it('should not apply the rates the shippingMethodModel because no rate should be found, these would be user defined methods after shq is installed', function () {
            var shippingMethodModel = {
                ID: 'dummy',
                displayName: 'Dummy',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethodNonSHQ(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'dummy');
            assert.equal(shippingMethodModel.shippingCost, '$5.00');
        });
    });

    describe('applyShippingRateData without cached ratesList (non-merged rates)', function () {
        beforeEach(function () {
            cacheHelper.setCacheHit(false); // use non cached rates
        });
        afterEach(function () {
            cacheHelper.setCacheHit(true); // make sure to return to normal cached rates after to be used for remaining tests
        });

        it('should apply the rates the shippingMethodModel', function () {
            var shippingMethodModel = {
                ID: 'shqflat_fixed ',
                displayName: 'fixed',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethod(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'shqflat_fixed ');
            assert.equal(shippingMethodModel.shippingCost, '$42.22');
        });

        it('should not apply the rates the shippingMethodModel or even make call out, these would be previously defined methods before shq', function () {
            var shippingMethodModel = {
                ID: 'fixed',
                displayName: 'fixed',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethodSHQDisabled(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'fixed');
            assert.equal(shippingMethodModel.shippingCost, '$5.00');
        });

        it('should not apply the rates the shippingMethodModel because no rate should be found, these would be user defined methods after shq is installed', function () {
            var shippingMethodModel = {
                ID: 'dummy',
                displayName: 'Dummy',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };


            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethodNonSHQ(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'dummy');
            assert.equal(shippingMethodModel.shippingCost, '$5.00');
        });
    });

    describe('applyShippingRateData without cached ratesList (merged rates)', function () {
        beforeEach(function () {
            cacheHelper.setCacheHit(false);
            ShipperHQ.setMergedRates(true); // use non cached rates
        });
        afterEach(function () {
            cacheHelper.setCacheHit(true);
            ShipperHQ.setMergedRates(false); // make sure to return to normal values after in case other tests use
        });

        it('should apply the rates the shippingMethodModel from both $10 rate and $42.22 rate', function () {
            var shippingMethodModel = {
                ID: 'shqflat_fixed',
                displayName: 'fixed',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };

            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethod(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'shqflat_fixed');
            assert.equal(shippingMethodModel.shippingCost, '$52.22');
        });

        it('no rate found in the merge for dummy method so shipping method model should not be changed', function () {
            var shippingMethodModel = {
                ID: 'dummy',
                displayName: 'Dummy',
                description: null,
                estimatedArrivalTime: null,
                default: true,
                shippingCost: '$5.00',
                selected: true
            };

            // test shipperHQRates
            ratesHelper.applyShippingRateData(shippingMethodModel, builder.buildShippingMethodNonSHQ(), builder.buildShipment());
            assert.equal(shippingMethodModel.ID, 'dummy');
            assert.equal(shippingMethodModel.shippingCost, '$5.00');
        });
    });

    describe('getShippingCost', function () {
        it('makes sure the rate is obtained for the shipping method and returned', function () {
            // test rate is obtained for shipping method
            var shippingCost = ratesHelper.getShippingCost(builder.buildShippingMethod(), builder.buildShipment(), builder.buildAddress(), buildCustomer());
            assert.equal(shippingCost.amount.value, 35.22);
            assert.equal(shippingCost.amount.currencyCode, 'USD');
        });
    });

    describe('getShippingMethodFilter', function () {
        it('makes sure that filter function is returned in order to grab filter booleanused to remove rates', function () {
            var filter = ratesHelper.getShippingMethodFilter(builder.buildShipment(), builder.buildAddress(), buildCustomer());
            var methodAllowed = !filter(builder.buildShippingMethod()); // shipping method is found with rates and shq enabled
            assert.equal(methodAllowed, true);
        });


        it('makes sure that filter returns false in order to remove rate that does not apply to SHQ ', function () {
            var filter = ratesHelper.getShippingMethodFilter(builder.buildShipment(), builder.buildAddress(), buildCustomer());
            var methodAllowed = !filter(builder.buildShippingMethodNonSHQ()); // shipping method defined outside of allowed methods in SHQ with shq enabled
            assert.equal(methodAllowed, false);
        });
    });

    describe('isOrderPlaced', function () {
        it('checks to see if order number has been set/placed on the shipment, which it has been not', function () {
            var orderPlaced = ratesHelper.isOrderPlaced(builder.buildShipment());
            assert.equal(orderPlaced, false);
        });
    });

    // not sure this is okay, had mocked Configuration.enabled() to return true which is called within this function
    describe('isShipperHQEnabled', function () {
        it('checks to determine if shipperHQ is enabled before making a call out to update rates', function () {
            var shqEnabled = ratesHelper.isShipperHQEnabled();
            assert.equal(shqEnabled, true);
        });
    });

    describe('isShipperHQShippingMethod', function () {
        it('checks shippingMethod to determine if shipperHQ rate is needed, shippingMethod is allowed method from SHQ', function () {
            var shqEnabled = ratesHelper.isShipperHQShippingMethod(builder.buildShippingMethod());
            assert.equal(shqEnabled, true);
        });
    });
});
