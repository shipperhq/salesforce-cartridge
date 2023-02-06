'use strict';

var CacheMgr = function () {};

CacheMgr.getCache = function () {
    return {
        get: function () {
            return {
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
                            value: 42.22
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
        }
    };
};

// CacheMgr.prototype.get(){};

module.exports = CacheMgr;
