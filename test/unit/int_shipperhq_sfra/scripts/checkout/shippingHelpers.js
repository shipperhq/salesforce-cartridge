'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

// shippingHelper includes
var mockSuperModule = require('../../../../mockModuleSuperModule');
var baseShippingHelpersMock = require('../../../../mocks/scripts/checkout/baseShippingHelpers');
var collections = require('../../../../mocks/util/collections');
var ShippingMgr = require('../../../../mocks/dw/order/ShippingMgr');
var ratesHelper = require('../../../../mocks/helpers/ratesHelper'); // use all the mock info created for ratesHelper
var builder = require('../../builder');


var shippingMethodModel = function () {
    this.shippingCost = '$42.22';
    this.displayName = 'fixed';
    this.ID = 'shqflat_fixed';
};

function buildShipmentNoAddress() {
    var shipment = {
        adjustedMerchandizeTotalPrice: { value: 25.00 },
        productLineItems: [
            {
                product: {
                    custom: {
                        shipWeight: 15.00
                    }
                },
                quantity: { value: 2 },
                UUID: '123456',
                productID: 'SKU-1',
                priceValue: 25.00,
                quantityValue: 1,
                tax: { value: 0.00 },
                adjustedGrossPrice: { value: 25.00 },
                adjustedPrice: { value: 25.00 },
                basePrice: {
                    value: 25.00,
                    currencyCode: 'USD'
                },
                taxRate: 0.08

            }
        ],
        custom: {
            shipperHQRatesCache: null
        },
        shippingAddress: null,
        shipmentNo: null
    };
    return shipment;
}

describe('ShippingHelpers', function () {
    describe('getApplicableShippingMethods', function () {
        var shippingHelpers;

        before(function () {
            mockSuperModule.create(baseShippingHelpersMock);

            shippingHelpers = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/checkout/shippingHelpers', {
                '*/cartridge/scripts/util/collections': collections,
                'dw/order/ShippingMgr': ShippingMgr,
                '*/cartridge/models/shipping/shippingMethod': shippingMethodModel,
                '*/cartridge/scripts/helpers/ratesHelper': ratesHelper
            });
        });


        it('should return null when there is no shipment', function () {
            var shipment = null;
            var address = {};
            var shippingMethods = shippingHelpers.getApplicableShippingMethods(shipment, address);
            assert.isNull(shippingMethods);
        });

        it('should return fixed shq method and filter out dummy method', function () {
            var shippingMethods = shippingHelpers.getApplicableShippingMethods(builder.buildShipment(), builder.buildAddress());
            assert.equal(shippingMethods.length, 1);
            assert.equal(shippingMethods[0].shippingCost, '$42.22');
            assert.equal(shippingMethods[0].ID, 'shqflat_fixed');
        });

        it('should not return any valid rates without an address', function () {
            var address = null;
            var shippingMethods = shippingHelpers.getApplicableShippingMethods(buildShipmentNoAddress(), address);
            assert.equal(shippingMethods.length, 0);
        });
    });
});
