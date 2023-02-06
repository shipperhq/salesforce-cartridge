'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

// shippingHelper includes
var mockSuperModule = require('../../../../mockModuleSuperModule');
var baseShippingMethodMock = require('../../../../mocks/models/shipping/baseShippingMethod');
var ratesHelper = require('../../../../mocks/helpers/ratesHelper');
var builder = require('../../builder'); // use all the mock info created for ratesHelper
var cacheHelper = require('../../../../mocks/helpers/cacheHelper');

describe('Shipping Method Model ShipperHQ', function () {
    var ShippingMethodModel;

    before(function () {
        mockSuperModule.create(baseShippingMethodMock);

        ShippingMethodModel = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/models/shipping/shippingMethod', {
            '*/cartridge/scripts/helpers/ratesHelper': ratesHelper
        });

        cacheHelper.setCacheHit(true); // needs to be true first since this function uses first
        global.customer = {
            customerGroups: [{ ID: 'guest' }, { ID: 'retail' }] // customer defined at the top here
        };
    });

    after(function () {
        mockSuperModule.remove();
    });

    it('should return shippingMethodModel with obtained SHQ Rate, in order to update shipping method', function () {
        var shipping = new ShippingMethodModel(builder.buildShippingMethod(), builder.buildShipment());
        assert.equal(shipping.shippingCost, '$35.22');
    });

    it('should not update shippingMethodModel with SHQ Rate for non-shq method', function () {
        var shipping = new ShippingMethodModel(builder.buildShippingMethodNonSHQ(), builder.buildShipment());
        assert.equal(shipping.shippingCost, null);
    });
});
