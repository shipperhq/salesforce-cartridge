
'use strict';

var ArrayList = require('../../../mocks/dw.util.Collection');

var defaultShippingMethod =
    {
        description: null,
        displayName: 'fixed',
        ID: 'shqflat_fixed',
        custom: {
            shipperHQRates: true
        },
        customerGroups: [],
        defaultMethod: true,
        currencyCode: 'USD'
    };

function createShipmentShippingModel() {
    return {
        applicableShippingMethods: new ArrayList([
            {
                description: null,
                displayName: 'fixed',
                ID: 'shqflat_fixed',
                custom: {
                    shipperHQRates: true
                },
                customerGroups: [],
                defaultMethod: true,
                currencyCode: 'USD'
            },
            {
                description: null,
                displayName: 'dummy',
                ID: 'dummy',
                custom: {
                    shipperHQRates: true
                },
                customerGroups: [],
                defaultMethod: true,
                currencyCode: 'USD'
            }
        ]),
        getApplicableShippingMethods: function () {
            return new ArrayList([
                {
                    description: null,
                    displayName: 'fixed',
                    ID: 'shqflat_fixed',
                    custom: {
                        shipperHQRates: true
                    },
                    customerGroups: [],
                    defaultMethod: true,
                    currencyCode: 'USD'
                },
                {
                    description: null,
                    displayName: 'dummy',
                    ID: 'dummy',
                    custom: {
                        shipperHQRates: true
                    },
                    customerGroups: [],
                    defaultMethod: true,
                    currencyCode: 'USD'
                }
            ]);
        },
        getShippingCost: function () {
            return {
                amount: {
                    valueOrNull: 7.99
                }
            };
        }
    };
}

function createLineItemContainer() {
    return {
        lineItemContainer: {
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
                    shipmentNo: null
                }
            ]
        }
    };
}

module.exports = {
    getDefaultShippingMethod: function () {
        return defaultShippingMethod;
    },
    getShipmentShippingModel: function (shipment) {
        return createShipmentShippingModel(shipment);
    },
    applyShippingCost: function (lineItemContainer) {
        return createLineItemContainer(lineItemContainer);
    }
};
