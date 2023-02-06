'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

// ////
var Bytes = require('../../../../mocks/dw/util/Bytes');
var CacheMgr = require('../../../../mocks/dw/system/CacheMgr');
var MessageDigest = require('../../../../mocks/dw/crypto/MessageDigest');
// ////

var cacheHelper = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/helpers/cacheHelper', {
    'dw/system/CacheMgr': CacheMgr,
    'dw/crypto/MessageDigest': MessageDigest,
    'dw/util/Bytes': Bytes
});

describe('CacheHelper ShipperHQ', function () {
    describe('getCache', function () {
        it('should find cachedRates and return them if found', function () {
            var payload = {
                credentials: {
                    password: 'MyPassword',
                    apiKey: '8cb83c857364ad5d6d48ee9c5197006d'
                },
                siteDetails: {
                    ecommerceCart: 'Bigcommerce',
                    ecommerceVersion: '',
                    websiteUrl: '',
                    environmentScope: 'LIVE',
                    appVersion: ' ',
                    ipAddress: ''
                },
                cart: {
                    declaredValue: null,
                    freeShipping: false,
                    items: [
                        {
                            rowTotal: 8.59,
                            basePrice: 8.59,
                            storePrice: 8.59,
                            taxInclStorePrice: 8.59,
                            taxInclBasePrice: 8.59,
                            discountedStorePrice: 8.59,
                            discountedBasePrice: 8.59,
                            discountedTaxInclStorePrice: 8.59,
                            discountedTaxInclBasePrice: 8.59,
                            weight: 20.6,
                            qty: 1,
                            id: '999',
                            sku: 'TA038158',
                            name: null,
                            description: null,
                            attributes: [
                                {
                                    name: 'shipperhq_warehouse',
                                    value: 'illinois'
                                },
                                { name: 'shipperhq_shipping_group',
                                    value: 'Medium#Large'
                                }
                            ],
                            baseRowTotal: null,
                            baseCurrency: 'USD',
                            packageCurrency: 'USD',
                            storeBaseCurrency: 'USD',
                            storeCurrentCurrency: 'USD',
                            taxPercentage: 0,
                            discountPercent: 0,
                            discountAmount: null,
                            freeShipping: false,
                            defaultWarehouseStockDetail: null,
                            warehouseDetails: null,
                            pickupLocationDetails: null,
                            freeMethodWeight: 1.6,
                            additionalAttributes: [],
                            legacyAttributes: [],
                            items: [],
                            type: 'simple',
                            fixedPrice: false,
                            fixedWeight: false,
                            attributeMap: {

                            }
                        },
                        {
                            rowTotal: 8.59,
                            basePrice: 8.59,
                            storePrice: 8.59,
                            taxInclStorePrice: 8.59,
                            taxInclBasePrice: 8.59,
                            discountedStorePrice: 8.59,
                            discountedBasePrice: 8.59,
                            discountedTaxInclStorePrice: 8.59,
                            discountedTaxInclBasePrice: 8.59,
                            weight: 20.6,
                            qty: 1,
                            id: '999',
                            sku: 'TA038158',
                            name: null,
                            description: null,
                            attributes: [
                                {
                                    name: 'shipperhq_warehouse',
                                    value: 'farmingdale'
                                }
                            ],
                            baseRowTotal: null,
                            baseCurrency: 'USD',
                            packageCurrency: 'USD',
                            storeBaseCurrency: 'USD',
                            storeCurrentCurrency: 'USD',
                            taxPercentage: 0,
                            discountPercent: 0,
                            discountAmount: null,
                            freeShipping: false,
                            defaultWarehouseStockDetail: null,
                            warehouseDetails: null,
                            pickupLocationDetails: null,
                            freeMethodWeight: 1.6,
                            additionalAttributes: [],
                            legacyAttributes: [],
                            items: [],
                            type: 'simple',
                            fixedPrice: false,
                            fixedWeight: false,
                            attributeMap: {

                            }
                        }
                    ]
                },
                destination: {
                    country: 'US',
                    region: 'TX',
                    city: 'Austin',
                    street: '',
                    street2: '',
                    zipcode: '78701',
                    selectedOptions: null,
                    email: null,
                    givenName: null,
                    familyName: null,
                    telNo: null,
                    companyName: null,
                    destinationType: null,
                    accessorials: null
                },
                customerDetails: {
                    customerGroup: ''
                },
                cartType: 'STD',
                deliveryDateUTC: null,
                deliveryDate: null,
                carrierGroupId: null,
                carrierId: null,
                carrierCode: null,
                shipDetails: null,
                validateAddress: true
            };

            var rates = cacheHelper.getCache(payload, function () {});
            assert.equal(rates.shqflat_fixed.ID, 'shqflat_fixed'); // Not sure about this test
        });
    });
});
