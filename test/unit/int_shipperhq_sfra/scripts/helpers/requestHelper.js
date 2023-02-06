'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var collections = require('../../../../mocks/util/collections');
var ArrayList = require('../../../../mocks/dw/util/ArrayList');

var requestHelper = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/helpers/requestHelper', {
    '*/cartridge/scripts/util/collections': collections,
    'dw/util/ArrayList': ArrayList
});

function buildCustomer() {
    var customer = {
        customerGroups: [{ ID: 'guest' }, { ID: 'retail' }]
    };

    return customer;
}

function buildAddress() {
    var address = {
        countryCode: { value: 'US' },
        stateCode: { value: 'TX' },
        city: 'Austin',
        address1: '51 Rainey St',
        postalCode: '78701'
    };
    return address;
}

describe('RequestHelper ShipperHQ', function () {
    describe('getRequestPayload', function () {
        beforeEach(function () {      // only tests that use so don't have to set higher up
            global.empty = function (value) {
                if (value === null || value === undefined || value.length === 0) {
                    return true;
                }
                return false;
            };
        });
        it('should map basic productLineItems appropriately to shipperHQ request payload', function () {
            var shipment = {
                adjustedMerchandizeTotalPrice: { value: 25.00 },
                productLineItems: [
                    {
                        product: {
                            custom: {
                                shipWeight: 15.00
                            },
                            ID: 'SKU-1'
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
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.cart.items[0].sku, 'SKU-1');
        });

        it('if no attributes set on item, none should come through', function () {
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
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.cart.items[0].attributes.length, 0);
        });

        it('check that dim groups, shipping groups, and warehouses are # separated, and only attributes set', function () {
            var shipment = {
                adjustedMerchandizeTotalPrice: { value: 25.00 },
                productLineItems: [
                    {
                        product: {
                            custom: {
                                shipWeight: 15.00,
                                shipperHQDimGroups: ['Rule 1', 'Rule 2'],
                                shipperHQShippingGroups: ['Group1', 'Group2'],
                                shipperHQWarehouses: ['Austin', 'Dallas']
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
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.cart.items[0].attributes[0].value, 'Rule 1#Rule 2'); // attributes processed in this order
            assert.equal(payload.cart.items[0].attributes[1].value, 'Group1#Group2');
            assert.equal(payload.cart.items[0].attributes[2].value, 'Austin#Dallas');
            assert.equal(payload.cart.items[0].attributes.length, 3);
        });

        it('check customer group comes over comma separated', function () {
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
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.customerDetails.customerGroup, 'guest,retail');
        });

        it('check bundle product values get properly constructed on request', function () {
            var shipment = {
                adjustedMerchandizeTotalPrice: { value: 25.00 },
                productLineItems: [
                    {
                        product: {
                            custom: {
                                shipWeight: 20.00,
                                shipperHQShippingGroups: ['Parent']
                            },
                            bundle: true,
                            ID: 'SKU-1'
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
                        taxRate: 0.08,
                        bundledProductLineItems: [
                            {
                                product: {
                                    custom: {
                                        shipWeight: 15.00,
                                        shipperHQShippingGroups: ['Child']
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
                        ]


                    }
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.cart.items[0].attributes[0].value, 'Parent');
            assert.equal(payload.cart.items[0].items[0].attributes[0].value, 'Child');
            assert.equal(payload.cart.items[0].weight, 20);
            assert.equal(payload.cart.items[0].items[0].weight, 15);
        });

        it('check that variant product gets properly constructed on request', function () {
            var shipment = {
                adjustedMerchandizeTotalPrice: { value: 25.00 },
                productLineItems: [
                    {
                        product: {
                            custom: {
                                shipWeight: 15.00,
                                shipperHQShippingGroups: ['Child']
                            },
                            variant: true,
                            masterProduct: {
                                custom: {
                                    shipWeight: 20.00,
                                    shipperHQShippingGroups: ['Parent'],
                                    ID: '25518447M',
                                    UUID: '1234567890'
                                },
                                master: true
                            },
                            ID: 'SKU-1'
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
                ]
            };
            var payload = requestHelper.getRequestPayload(shipment, buildAddress(), buildCustomer());
            assert.equal(payload.cart.items[0].attributes[0].value, 'Parent');
            assert.equal(payload.cart.items[0].items[0].attributes[0].value, 'Child');
            assert.equal(payload.cart.items[0].weight, 20);
            assert.equal(payload.cart.items[0].items[0].weight, 15);
        });
    });
});
