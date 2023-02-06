'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var Logger = require('../../../../../mocks/dw/Logger');
var ShippingLineItem = require('../../../../../mocks/dw/order/ShippingLineItem');
var ShippingMgr = require('../../../../../mocks/dw/order/ShippingMgr');
var Status = require('../../../../../mocks/dw/system/Status');
var Site = require('../../../../../mocks/dw/system/Site');
var collections = require('../../../../../mocks/util/collections');
var ratesHelper = require('../../../../../mocks/helpers/ratesHelper');

var calculateShippingHook = proxyquire('../../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/hooks/cart/calculateShipping', {
    'dw/order/ShippingLineItem': ShippingLineItem,
    'dw/order/ShippingMgr': ShippingMgr,
    'dw/system/Logger': Logger,
    'dw/system/Status': Status,
    'dw/system/Site': Site,
    '*/cartridge/scripts/util/collections': collections,
    '*/cartridge/scripts/helpers/ratesHelper': ratesHelper
});

describe('CalculateShipping Hook ShipperHQ', function () {
    describe('calculateShipping', function () {
        it('hook should be called to apply shipperHQRates, and return 200 Status after', function () {
            var shippingLineItem = {
                adjustedGrossPrice: 0,
                adjustedNetPrice: 0,
                adjustedPrice: 0,
                adjustedTax: 0,
                basePrice: 0,
                grossPrice: 0,
                ID: 'STANDARD_SHIPPING',
                lineItemText: 'Shipping',
                priceValue: 0

            };
            var lineItemContainer = {
                shipments: [
                    {
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
                        shippingAddress: {
                            countryCode: { value: 'US' },
                            stateCode: { value: 'TX' },
                            city: 'Austin',
                            address1: '51 Rainey St',
                            postalCode: '78701'
                        },
                        shipmentNo: null,
                        shippingMethod: {
                            currencyCode: 'USD',
                            defaultMethod: true,
                            description: null,
                            displayName: 'fixed',
                            ID: 'shqflat_fixed',
                            custom: {
                                shipperHQRates: true
                            }
                        },
                        getShippingLineItem: function () {
                            return {
                                adjustedGrossPrice: 0,
                                adjustedNetPrice: 0,
                                adjustedPrice: 0,
                                adjustedTax: 0,
                                basePrice: 0,
                                grossPrice: 0,
                                ID: 'STANDARD_SHIPPING',
                                lineItemText: 'Shipping',
                                setPriceValue: function (cost) {
                                    var sli = shippingLineItem;
                                    sli.priceValue = cost;
                                }

                            };
                        }
                    }
                ] };

            var status = calculateShippingHook.calculateShipping(lineItemContainer);
            assert.equal(200, status.OK);
            assert.equal(shippingLineItem.priceValue, 35.22); // by default should be hitting cached rate
        });
    });
});

