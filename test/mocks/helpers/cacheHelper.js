'use strict';

var cacheHit = false; // when false use callback

function getCache(request, callback) {
    var processedRates;
    if (cacheHit) {
        processedRates = {
            shqflat_fixed: {
                custom: {
                    estimatedArrivalTime: null,
                    storePickupEnabled: false
                },
                defaultMethod: null,
                description: '',
                displayName: 'fixed',
                ID: 'shqflat_fixed',
                shippingCost: {
                    amount: {
                        currencyCode: 'USD',
                        value: 35.22
                    }
                }
            },
            shqfree4_free: {
                custom: {
                    estimatedArrivalTime: null,
                    storePickupEnabled: false
                },
                defaultMethod: null,
                description: '',
                displayName: 'Free',
                ID: 'shqfree4_free ',
                shippingCost: {
                    amount: {
                        currencyCode: 'USD',
                        value: 0.00
                    }
                }
            }
        };
    } else {
        processedRates = callback();// call callback here
    }

    return processedRates;
}

module.exports = {
    getCache: getCache,
    setCacheHit: function (val) { // not part of api
        cacheHit = val;
    }
}
;
