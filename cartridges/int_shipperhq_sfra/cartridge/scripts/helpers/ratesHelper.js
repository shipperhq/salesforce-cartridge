'use strict';

/* API Includes */
var Logger = require('dw/system/Logger').getLogger('ShipperHQ', 'service');

/* Local Includes */
var ShipperHQ = require('*/cartridge/scripts/services/rest');
var requestHelper = require('*/cartridge/scripts/helpers/requestHelper');
var cacheHelper = require('*/cartridge/scripts/helpers/cacheHelper');

var Configuration = require('*/cartridge/scripts/configuration');

/**
 * Returns cartridge enable/disable status.
 *
 * @returns {boolean|null} ShipperHQ enable/disable status.
 */
function isShipperHQEnabled() {
    return Configuration.enabled();
}

/**
 * Identifies shippping method as one that should use ShipperHQ rates.
 *
 * @param {dw.order.ShippingMethod} shippingMethod Shipping method being processed.
 * @returns {boolean} ShipperHQ method status.
 */
function isShipperHQShippingMethod(shippingMethod) {
    return shippingMethod.custom.shipperHQRates === true;
}

/**
 * Uses shipmentNo as a proxy for order placement status in the context of a shipment.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @returns {boolean} Order placement status.
 */
function isOrderPlaced(shipment) {
    return shipment.shipmentNo !== null;
}

/**
 * Checks if rates are stored on the shipment from a shipping calculation.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @returns {boolean} Whether rates are stored on the shipment.
 */
function hasStoredRates(shipment) {
    return shipment.custom.shipperHQRatesCache !== null;
}

/**
 * Sets the processed rates on the shipment object for future reference.
 *
 * This function is necessitated by the model architecture used in SFRA. Because
 * calls for rates happen even after order placement, we must provide a way to access
 * the rates without making a meaningless rate request. Further, this function does
 * include a transcation intentionally. This is because the rates should really only
 * be set during rate calculation, which happens within a transactional hook.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @param {Object} rates rate data in useful format.
 */
function setStoredRates(shipment, rates) {
    try {
        // eslint-disable-next-line no-param-reassign
        if (Object.keys(rates).length) shipment.custom.shipperHQRatesCache = JSON.stringify(rates);
    } catch (e) {
        Logger.error('Stringifying rates for storage: {0}', e);
    }
}

/**
 * Retrieves rates stored on shipment during calculation as an object.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @returns {Object} Stored rate data.
 */
function getStoredRates(shipment) {
    var rates;
    var ratesString = shipment.custom.shipperHQRatesCache;

    try {
        rates = JSON.parse(ratesString);
    } catch (e) {
        Logger.error('Error parsing shipment stored rates: {0}', e);
    }

    return rates;
}

/**
 * Instantiates new service instance and calls rates endpoint with passed payload.
 *
 * @param {Object} requestPayload Prepared API request body.
 * @returns {Object} API response.
 */
function getAPIRate(requestPayload) {
    var shipperHQ = new ShipperHQ();
    return shipperHQ.rates.retrieve(requestPayload);
}

/**
 * Iterates over the returned shipping rates, extracating only the needed data in
 * a native format that can be injected into the native checkout flow.
 *
 * @param {Object} response Reponse object returned in the API request.
 * @returns {Object} Rate data in useful format.
 */
function processRates(response) {
    var ratesList = {};

    if (response.object) {
        var globalCurrency = '';
        if (response.object.globalSettings && response.object.globalSettings.currencyCode) {
            globalCurrency = response.object.globalSettings.currencyCode;
        }

        // error response is contained on 200 not pushing up message for now but is in logs
        if (response.object.errors && response.object.errors.length > 0) {
            return ratesList;
        }

        // if an errorResponse is not returned carrierGroups are always populated, if empty will return ratesList empty
        var carrierGroups = response.object.carrierGroups || [];

        // if there is no error response carrierGroups is always populated and mergedRateresponse.carrierRates is always populated with [] by default
        var carrierRatesResponse = carrierGroups[0];
        var carrierRates = response.object.mergedRateResponse ? response.object.mergedRateResponse.carrierRates : carrierRatesResponse.carrierRates;

        // both carrierRates share same object structure so can share same code
        carrierRates.forEach(function (carrierRate) {
            var rates = carrierRate.rates || [];

            rates.forEach(function (rate) {
                var currencyCode = rate.currency || globalCurrency;

                /**
                * method.ID now contains carrierCode in it to account for duplicate
                * carriers. We need to populate ratesList with same format for shipping
                * costs to match up with appropriate rate.
                */
                ratesList[carrierRate.carrierCode + '_' + rate.code] = {
                    ID: carrierRate.carrierCode + '_' + rate.code,
                    displayName: rate.name,
                    description: rate.description,
                    custom: {
                        estimatedArrivalTime: rate.deliveryMessage || null, // default is empty string so needs to be populated to display
                        storePickupEnabled: false
                    },
                    defaultMethod: null,
                    shippingCost: {
                        amount: {
                            currencyCode: currencyCode.toUpperCase(),
                            value: rate.totalCharges
                        }
                    }
                };
            });
        });
    }

    return ratesList;
}

/**
 * Retreives shipping rates from the ShipperHQ service or cache if available.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @param {dw.order.Address} address Shipping address to use in the rates calculation.
 * @param {dw.customer.Customer} customer Customer to use in rates calculation.
 * @returns {Object} Rate data in useful format.
 */
function getRates(shipment, address, customer) {
    var rates;
    var orderPlaced = isOrderPlaced(shipment);

    if (orderPlaced && hasStoredRates(shipment)) {
        rates = getStoredRates(shipment);
    }

    if (!orderPlaced && isShipperHQEnabled()) {
        var shippingAddress = address;
        if (!shippingAddress && shipment && shipment.shippingAddress) {
            shippingAddress = shipment.shippingAddress;
        }

        if (shippingAddress) {
            try {
                var requestPayload = requestHelper.getRequestPayload(shipment, shippingAddress, customer);

                rates = cacheHelper.getCache(requestPayload, function () {
                    var response = getAPIRate(requestPayload);
                    var processedRates = processRates(response);

                    // Store the processed rates for post-order placement
                    setStoredRates(shipment, processedRates);

                    return processedRates;
                });
            } catch (e) {
                Logger.error('Error retrieving rates: {0}', e);
            }
        }
    }

    return rates || {};
}

/**
 * Retrieve a single shipping rate.
 *
 * Due to the common use case and for the sake of efficiency, this relies on the
 * bulk rate retrieval as it is likely cached, instead of requesting just this rate.
 *
 * @param {dw.order.ShippingMethod} shippingMethod Method to retrieve from the rates.
 * @param {dw.order.Shipment} shipment Shipment to rate.
 * @param {dw.order.OrderAddress} address Address to rate.
 * @param {dw.customer.Customer} customer Customer to rate.
 * @returns {Object} Destination request object.
 */
function getRate(shippingMethod, shipment, address, customer) {
    var rate;
    if (isShipperHQShippingMethod(shippingMethod)) {
        var rates = getRates(shipment, address, customer);
        // eslint-disable-next-line no-prototype-builtins
        if (shippingMethod.ID && rates.hasOwnProperty(shippingMethod.ID)) rate = rates[shippingMethod.ID];
    }

    return rate;
}

/**
 * Retrieves rate for a given shipment and shipping method.
 *
 * @param {dw.order.ShippingMethod} shippingMethod Shipping method rate to retieve.
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @param {dw.order.Address} address Shipping address to use in the rates calculation.
 * @param {dw.customer.Customer} customer Customer to use in rates calculation.
 * @returns {Object|null} Requested rate or null if not available.
 */
function getShippingCost(shippingMethod, shipment, address, customer) {
    var rate = getRate(shippingMethod, shipment, address, customer);

    return rate ? rate.shippingCost : null;
}

/**
 * Creates a filter function to use when processing SFCC shipping methods with ShipperHQ rates.
 *
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 * @param {dw.order.Address} address Shipping address to use in the rates calculation.
 * @param {dw.customer.Customer} customer Customer to use in rates calculation.
 * @returns {Function} Filter function used to remove invalid shipping methods.
 */
function getShippingMethodFilter(shipment, address, customer) {
    var rates = getRates(shipment, address, customer);

    var filterFunction = function (shippingMethod) {
        // eslint-disable-next-line no-prototype-builtins
        return isShipperHQShippingMethod(shippingMethod) && (!shippingMethod.ID || !rates.hasOwnProperty(shippingMethod.ID));
    };

    return filterFunction;
}

/**
 * Formats shipping rate based on the provided currency.
 *
 * @param {number} value Numeric value to format.
 * @param {string} currencyCode Currency code corresponding to the value.
 * @returns {string} Formatted shipping rate. *
 */
function formatShippingCost(value, currencyCode) {
    var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;

    return formatCurrency(value, currencyCode);
}

/**
 * Applies rate data to the shipping method model.
 *
 * @param {Object} shippingMethodModel Model representing the shipping method.
 * @param {dw.order.ShippingMethod} shippingMethod Shipping method rate to retieve.
 * @param {dw.order.Shipment} shipment Shipment to use in the rates calculation.
 */
function applyShippingRateData(shippingMethodModel, shippingMethod, shipment) {
    var rate = getRate(shippingMethod, shipment, shipment.shippingAddress, customer);

    var shqShippingMethod = shippingMethodModel;

    if (rate) {
        // eslint-disable-next-line no-param-reassign
        shqShippingMethod.shippingCost = formatShippingCost(rate.shippingCost.amount.value, rate.shippingCost.amount.currencyCode);
        /** Add any additional model updates based on ShipperHQ rates here by either setting the value of an existing property or defining a new property */
        shqShippingMethod.estimatedArrivalTime = rate.custom ? rate.custom.estimatedArrivalTime : null;
    }
}

module.exports = {
    applyShippingRateData: applyShippingRateData,
    getShippingCost: getShippingCost,
    getShippingMethodFilter: getShippingMethodFilter,
    isOrderPlaced: isOrderPlaced,
    isShipperHQEnabled: isShipperHQEnabled,
    isShipperHQShippingMethod: isShipperHQShippingMethod
};
