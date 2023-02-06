'use strict';

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

function buildShipment() {
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
        shippingAddress: {
            countryCode: { value: 'US' },
            stateCode: { value: 'TX' },
            city: 'Austin',
            address1: '51 Rainey St',
            postalCode: '78701'
        },
        shipmentNo: null
    };
    return shipment;
}

function buildShippingMethod() {
    var shippingMethod = {
        UUID: '12345678',
        taxClassID: 'standard',
        online: true,
        ID: 'shqflat_fixed',
        displayName: 'fixed',
        description: null,
        custom: {
            shipperHQRates: true,
            storePickupEnabled: false
        },
        currencyCode: 'USD',
        customerGroups: []
    };
    return shippingMethod;
}

function buildShippingMethodSHQDisabled() {
    var shippingMethod = {
        UUID: '12345678',
        taxClassID: 'standard',
        online: true,
        ID: 'fixed',
        displayName: 'fixed',
        description: null,
        custom: {
            shipperHQRates: false,
            storePickupEnabled: false
        },
        currencyCode: 'USD',
        customerGroups: []
    };
    return shippingMethod;
}

// if they create a shipping method after importing metadata shipperHQRates is externally managed
function buildShippingMethodNonSHQ() {
    var shippingMethod = {
        UUID: '12345678',
        taxClassID: 'standard',
        online: true,
        ID: 'dummy',
        displayName: 'Dummy',
        description: null,
        custom: {
            shipperHQRates: true,
            storePickupEnabled: false
        },
        currencyCode: 'USD',
        customerGroups: []
    };
    return shippingMethod;
}

module.exports = {
    buildShippingMethodNonSHQ: buildShippingMethodNonSHQ,
    buildShippingMethodSHQDisabled: buildShippingMethodSHQDisabled,
    buildShippingMethod: buildShippingMethod,
    buildAddress: buildAddress,
    buildShipment: buildShipment
};
