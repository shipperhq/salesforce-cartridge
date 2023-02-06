'use strict';

/**
 * ShipperHQ function declaration.
 */
// function ShipperHQ() {

// }

var ShipperHQ = function () {};

var mergedRates = false;

// not part of api
ShipperHQ.setMergedRates = function (value) {
    mergedRates = value;
};

ShipperHQ.prototype.rates = {
    retrieve: function () {
        var fakeResponse;
        if (mergedRates) {
            fakeResponse = { 'object': {
                'errors': [],
                'responseSummary': {
                    'date': 1582583895477,
                    'version': '1.17.211',
                    'transactionId': 'SHQ_20200224_2238_ip_10_0_110_71_29246265',
                    'status': 1
                },
                'mergedRateResponse': {
                    'carrierRates': [
                        {
                            'carrierId': 50040,
                            'carrierName': 'Flat Rate 1',
                            'carrierCode': 'shqflat',
                            'carrierType': 'flat',
                            'carrierTitle': 'Flat Rate',
                            'customDescription': '',
                            'dateOption': 'none',
                            'deliveryDateMessage': '',
                            'deliveryDateFormat': 'yMd',
                            'notices': [],
                            'rates': [
                                {
                                    'code': 'fixed',
                                    'externalCode': null,
                                    'name': 'fixed',
                                    'description': '',
                                    'handlingFee': 0.00,
                                    'totalCharges': 52.22,
                                    'shippingPrice': 52.22,
                                    'deliveryDate': null,
                                    'deliveryDateStr': '',
                                    'latestDeliveryDate': null,
                                    'latestDeliveryDateStr': '',
                                    'dispatchDate': null,
                                    'dispatchDateStr': '',
                                    'cost': 0,
                                    'origShippingPrice': 10.00,
                                    'overrideRuleCharges': 0,
                                    'carrierType': 'flat',
                                    'carrierCode': 'shqflat',
                                    'negotiatedRate': false,
                                    'selectedOptions': null,
                                    'carrierTitle': 'Flat Rate',
                                    'currency': null,
                                    'customDuties': 0,
                                    'customsMessage': null,
                                    'rateBreakdownList': [
                                        {
                                            'carrierGroupId': '33334',
                                            'carrierCode': 'shqflat',
                                            'methodCode': 'fixed',
                                            'totalCharges': 42.22,
                                            'shippingPrice': 42.22,
                                            'handlingFee': 0.00,
                                            'carrierType': 'flat',
                                            'name': 'fixed',
                                            'shipments': [
                                                {
                                                    'name': 'SHQ_CUSTOM',
                                                    'weight': 20.6000,
                                                    'volume': 0,
                                                    'length': 0,
                                                    'width': 0,
                                                    'height': 0,
                                                    'packingWeight': 0,
                                                    'declaredValue': 0.00,
                                                    'surchargePrice': 0,
                                                    'boxedItems': [
                                                        {
                                                            'itemId': '999',
                                                            'sku': 'TA038158',
                                                            'weightPacked': 20.6000,
                                                            'indVolume': null,
                                                            'qtyPacked': 1.0000,
                                                            'volumePacked': 0
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            'carrierGroupId': '36774',
                                            'carrierCode': 'shqflat',
                                            'methodCode': 'fixed',
                                            'totalCharges': 10.00,
                                            'shippingPrice': 10.00,
                                            'handlingFee': 0.00,
                                            'carrierType': 'flat',
                                            'name': 'fixed',
                                            'shipments': [
                                                {
                                                    'name': 'SHQ_CUSTOM',
                                                    'weight': 20.6000,
                                                    'volume': 0,
                                                    'length': 0,
                                                    'width': 0,
                                                    'height': 0,
                                                    'packingWeight': 0,
                                                    'declaredValue': 0.00,
                                                    'surchargePrice': 0,
                                                    'boxedItems': [
                                                        {
                                                            'itemId': '999',
                                                            'sku': 'TA038158',
                                                            'weightPacked': 20.6000,
                                                            'indVolume': null,
                                                            'qtyPacked': 1.0000,
                                                            'volumePacked': 0
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    'deliveryMessage': '',
                                    'flatRulesApplied': [],
                                    'changeRulesApplied': [
                                        'Flat Charge $44.44',
                                        'Flat Charge 22.22'
                                    ],
                                    'shipments': null
                                }
                            ],
                            'pickupLocationDetails': null,
                            'calendarDetails': null,
                            'shipments': null,
                            'availableOptions': [],
                            'preventRulesApplied': [],
                            'error': null,
                            'sortOrder': 0
                        }
                    ],
                    'error': null
                },
                'globalSettings': {
                    'dateFormat': 'mm/dd/yyyy',
                    'currencyCode': 'usd',
                    'weightUnit': 'kg',
                    'dropshipShowMergedRates': true,
                    'dropshipShowItemDesc': false,
                    'dropshipDescription': 'Multiple Warehouses',
                    'dropshipTitle': 'Shipping',
                    'distanceUnit': 'MI',
                    'carrierGroupDescription': 'Origin',
                    'calendarConfirm': false,
                    'shippingTooltipText': '',
                    'showPickupMulti': false,
                    'cityRequired': false,
                    'sortByPrice': 'ascending',
                    'dropshipShowWeight': false,
                    'preferredLocale': 'en-US'
                },
                'addressValidationResponse': {
                    'errors': [],
                    'responseSummary': null,
                    'validationStatus': 'VALIDATION_NOT_ENABLED',
                    'suggestedAddresses': [],
                    'destinationType': 'UNKNOWN'
                },
                'carrierGroups': [
                    {
                        'carrierRates': [
                            {
                                'carrierId': 50040,
                                'carrierName': 'Flat Rate 1',
                                'carrierCode': 'shqflat',
                                'carrierType': 'flat',
                                'carrierTitle': 'Flat Rate',
                                'customDescription': '',
                                'dateOption': 'none',
                                'deliveryDateMessage': '',
                                'deliveryDateFormat': 'yMd',
                                'notices': [],
                                'rates': [
                                    {
                                        'code': 'fixed',
                                        'externalCode': null,
                                        'name': 'fixed',
                                        'description': '',
                                        'handlingFee': 0.00,
                                        'totalCharges': 42.22,
                                        'shippingPrice': 42.22,
                                        'deliveryDate': null,
                                        'deliveryDateStr': '',
                                        'latestDeliveryDate': null,
                                        'latestDeliveryDateStr': '',
                                        'dispatchDate': null,
                                        'dispatchDateStr': '',
                                        'cost': 0,
                                        'origShippingPrice': 10.00,
                                        'overrideRuleCharges': 0,
                                        'carrierType': 'flat',
                                        'carrierCode': 'shqflat',
                                        'negotiatedRate': false,
                                        'selectedOptions': null,
                                        'carrierTitle': 'Flat Rate',
                                        'currency': null,
                                        'customDuties': 0,
                                        'customsMessage': null,
                                        'rateBreakdownList': [],
                                        'deliveryMessage': '',
                                        'flatRulesApplied': [],
                                        'changeRulesApplied': [
                                            'Flat Charge $44.44',
                                            'Flat Charge 22.22'
                                        ],
                                        'shipments': null
                                    }
                                ],
                                'pickupLocationDetails': null,
                                'calendarDetails': null,
                                'shipments': [
                                    {
                                        'name': 'SHQ_CUSTOM',
                                        'weight': 20.6000,
                                        'volume': 0,
                                        'length': 0,
                                        'width': 0,
                                        'height': 0,
                                        'packingWeight': 0,
                                        'declaredValue': 0.00,
                                        'surchargePrice': 0,
                                        'boxedItems': [
                                            {
                                                'itemId': '999',
                                                'sku': 'TA038158',
                                                'weightPacked': 20.6000,
                                                'indVolume': null,
                                                'qtyPacked': 1.0000,
                                                'volumePacked': 0
                                            }
                                        ]
                                    }
                                ],
                                'availableOptions': [],
                                'preventRulesApplied': [],
                                'error': null,
                                'sortOrder': 0
                            }
                        ],
                        'carrierGroupDetail': {
                            'emailOption': null,
                            'checkoutDescription': 'illinois',
                            'name': 'illinois',
                            'carrierGroupId': '33334',
                            'dateFormat': 'mm/dd/yyyy',
                            'emailAddress': null,
                            'contactName': null,
                            'packingStation': null
                        },
                        'products': [
                            {
                                'id': '999',
                                'sku': 'TA038158',
                                'qty': 1,
                                'name': null
                            }
                        ]
                    },
                    {
                        'carrierRates': [
                            {
                                'carrierId': 50040,
                                'carrierName': 'Flat Rate 1',
                                'carrierCode': 'shqflat',
                                'carrierType': 'flat',
                                'carrierTitle': 'Flat Rate',
                                'customDescription': '',
                                'dateOption': 'none',
                                'deliveryDateMessage': '',
                                'deliveryDateFormat': 'yMd',
                                'notices': [],
                                'rates': [
                                    {
                                        'code': 'fixed',
                                        'externalCode': null,
                                        'name': 'fixed',
                                        'description': '',
                                        'handlingFee': 0.00,
                                        'totalCharges': 10.00,
                                        'shippingPrice': 10.00,
                                        'deliveryDate': null,
                                        'deliveryDateStr': '',
                                        'latestDeliveryDate': null,
                                        'latestDeliveryDateStr': '',
                                        'dispatchDate': null,
                                        'dispatchDateStr': '',
                                        'cost': 0,
                                        'origShippingPrice': 10.00,
                                        'overrideRuleCharges': 0,
                                        'carrierType': 'flat',
                                        'carrierCode': 'shqflat',
                                        'negotiatedRate': false,
                                        'selectedOptions': null,
                                        'carrierTitle': 'Flat Rate',
                                        'currency': null,
                                        'customDuties': 0,
                                        'customsMessage': null,
                                        'rateBreakdownList': [],
                                        'deliveryMessage': '',
                                        'flatRulesApplied': [],
                                        'changeRulesApplied': [],
                                        'shipments': null
                                    }
                                ],
                                'pickupLocationDetails': null,
                                'calendarDetails': null,
                                'shipments': [
                                    {
                                        'name': 'SHQ_CUSTOM',
                                        'weight': 20.6000,
                                        'volume': 0,
                                        'length': 0,
                                        'width': 0,
                                        'height': 0,
                                        'packingWeight': 0,
                                        'declaredValue': 0.00,
                                        'surchargePrice': 0,
                                        'boxedItems': [
                                            {
                                                'itemId': '999',
                                                'sku': 'TA038158',
                                                'weightPacked': 20.6000,
                                                'indVolume': null,
                                                'qtyPacked': 1.0000,
                                                'volumePacked': 0
                                            }
                                        ]
                                    }
                                ],
                                'availableOptions': [],
                                'preventRulesApplied': [],
                                'error': null,
                                'sortOrder': 0
                            },
                            {
                                'carrierId': 60377,
                                'carrierName': 'Free',
                                'carrierCode': 'shqfree4',
                                'carrierType': 'free',
                                'carrierTitle': 'Free',
                                'customDescription': '',
                                'dateOption': 'none',
                                'deliveryDateMessage': '',
                                'deliveryDateFormat': 'yMd',
                                'notices': [],
                                'rates': [
                                    {
                                        'code': 'free',
                                        'externalCode': null,
                                        'name': 'Free',
                                        'description': '',
                                        'handlingFee': 0.00,
                                        'totalCharges': 0.00,
                                        'shippingPrice': 0.00,
                                        'deliveryDate': null,
                                        'deliveryDateStr': '',
                                        'latestDeliveryDate': null,
                                        'latestDeliveryDateStr': '',
                                        'dispatchDate': null,
                                        'dispatchDateStr': '',
                                        'cost': 0,
                                        'origShippingPrice': 0.00,
                                        'overrideRuleCharges': 0,
                                        'carrierType': 'free',
                                        'carrierCode': 'shqfree4',
                                        'negotiatedRate': false,
                                        'selectedOptions': null,
                                        'carrierTitle': 'Free',
                                        'currency': null,
                                        'customDuties': 0,
                                        'customsMessage': null,
                                        'rateBreakdownList': [],
                                        'deliveryMessage': '',
                                        'flatRulesApplied': [],
                                        'changeRulesApplied': [],
                                        'shipments': null
                                    }
                                ],
                                'pickupLocationDetails': null,
                                'calendarDetails': null,
                                'shipments': [
                                    {
                                        'name': 'SHQ_CUSTOM',
                                        'weight': 20.6000,
                                        'volume': 0,
                                        'length': 0,
                                        'width': 0,
                                        'height': 0,
                                        'packingWeight': 0,
                                        'declaredValue': 0.00,
                                        'surchargePrice': 0,
                                        'boxedItems': [
                                            {
                                                'itemId': '999',
                                                'sku': 'TA038158',
                                                'weightPacked': 20.6000,
                                                'indVolume': null,
                                                'qtyPacked': 1.0000,
                                                'volumePacked': 0
                                            }
                                        ]
                                    }
                                ],
                                'availableOptions': [],
                                'preventRulesApplied': [],
                                'error': null,
                                'sortOrder': 0
                            }
                        ],
                        'carrierGroupDetail': {
                            'emailOption': null,
                            'checkoutDescription': '',
                            'name': 'farmingdale',
                            'carrierGroupId': '36774',
                            'dateFormat': 'mm/dd/yyyy',
                            'emailAddress': null,
                            'contactName': null,
                            'packingStation': null
                        },
                        'products': [
                            {
                                'id': '999',
                                'sku': 'TA038158',
                                'qty': 1,
                                'name': null
                            }
                        ]
                    }
                ]
            }
            };
        } else {
            fakeResponse = { 'object': {
                'errors': [],
                'responseSummary': {
                    'date': 1582583895477,
                    'version': '1.17.211',
                    'transactionId': 'SHQ_20200224_2238_ip_10_0_110_71_29246265',
                    'status': 1
                },
                'mergedRateResponse': null,
                'globalSettings': {
                    'dateFormat': 'mm/dd/yyyy',
                    'currencyCode': 'usd',
                    'weightUnit': 'kg',
                    'dropshipShowMergedRates': true,
                    'dropshipShowItemDesc': false,
                    'dropshipDescription': 'Multiple Warehouses',
                    'dropshipTitle': 'Shipping',
                    'distanceUnit': 'MI',
                    'carrierGroupDescription': 'Origin',
                    'calendarConfirm': false,
                    'shippingTooltipText': '',
                    'showPickupMulti': false,
                    'cityRequired': false,
                    'sortByPrice': 'ascending',
                    'dropshipShowWeight': false,
                    'preferredLocale': 'en-US'
                },
                'addressValidationResponse': {
                    'errors': [],
                    'responseSummary': null,
                    'validationStatus': 'VALIDATION_NOT_ENABLED',
                    'suggestedAddresses': [],
                    'destinationType': 'UNKNOWN'
                },
                'carrierGroups': [
                    {
                        'carrierRates': [
                            {
                                'carrierId': 50040,
                                'carrierName': 'Flat Rate 1',
                                'carrierCode': 'shqflat',
                                'carrierType': 'flat',
                                'carrierTitle': 'Flat Rate',
                                'customDescription': '',
                                'dateOption': 'none',
                                'deliveryDateMessage': '',
                                'deliveryDateFormat': 'yMd',
                                'notices': [],
                                'rates': [
                                    {
                                        'code': 'fixed',
                                        'externalCode': null,
                                        'name': 'fixed',
                                        'description': '',
                                        'handlingFee': 0.00,
                                        'totalCharges': 42.22,
                                        'shippingPrice': 42.22,
                                        'deliveryDate': null,
                                        'deliveryDateStr': '',
                                        'latestDeliveryDate': null,
                                        'latestDeliveryDateStr': '',
                                        'dispatchDate': null,
                                        'dispatchDateStr': '',
                                        'cost': 0,
                                        'origShippingPrice': 10.00,
                                        'overrideRuleCharges': 0,
                                        'carrierType': 'flat',
                                        'carrierCode': 'shqflat',
                                        'negotiatedRate': false,
                                        'selectedOptions': null,
                                        'carrierTitle': 'Flat Rate',
                                        'currency': null,
                                        'customDuties': 0,
                                        'customsMessage': null,
                                        'rateBreakdownList': [],
                                        'deliveryMessage': '',
                                        'flatRulesApplied': [],
                                        'changeRulesApplied': [
                                            'Flat Charge $44.44',
                                            'Flat Charge 22.22'
                                        ],
                                        'shipments': null
                                    }
                                ],
                                'pickupLocationDetails': null,
                                'calendarDetails': null,
                                'shipments': [
                                    {
                                        'name': 'SHQ_CUSTOM',
                                        'weight': 20.6000,
                                        'volume': 0,
                                        'length': 0,
                                        'width': 0,
                                        'height': 0,
                                        'packingWeight': 0,
                                        'declaredValue': 0.00,
                                        'surchargePrice': 0,
                                        'boxedItems': [
                                            {
                                                'itemId': '999',
                                                'sku': 'TA038158',
                                                'weightPacked': 20.6000,
                                                'indVolume': null,
                                                'qtyPacked': 1.0000,
                                                'volumePacked': 0
                                            }
                                        ]
                                    }
                                ],
                                'availableOptions': [],
                                'preventRulesApplied': [],
                                'error': null,
                                'sortOrder': 0
                            }
                        ],
                        'carrierGroupDetail': {
                            'emailOption': null,
                            'checkoutDescription': 'illinois',
                            'name': 'illinois',
                            'carrierGroupId': '33334',
                            'dateFormat': 'mm/dd/yyyy',
                            'emailAddress': null,
                            'contactName': null,
                            'packingStation': null
                        },
                        'products': [
                            {
                                'id': '999',
                                'sku': 'TA038158',
                                'qty': 1,
                                'name': null
                            }
                        ]
                    }
                ]
            }
            };
        }

        return fakeResponse;
    }
};

ShipperHQ.prototype.methods = {
    list: function () {
        var fakeResponse = {
            object: {
                carrierMethods: [
                    {
                        carrierCode: 'shqflat',
                        sortOrder: 0,
                        title: 'Flat Rate',
                        methods: [{
                            methodCode: 'fixed',
                            name: 'fixed',
                            sortOrder: 0,
                            title: 'Flat Rate'
                        }]
                    }
                ]

            }
        };
        return fakeResponse;
    }
};

module.exports = ShipperHQ;
