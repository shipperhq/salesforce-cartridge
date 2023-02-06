'use strict';

/* API Includes */
var Logger = require('dw/system/Logger').getLogger('ShipperHQ', 'service');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

/* Local Includes */
var Configuration = require('*/cartridge/scripts/configuration');

/**
 * Retrieves HTTP Serivce for executing REST API call.
 *
 * @returns {dw.svc.HTTPService} HTTP service class for making REST API calls.
 */
function getShipperHQService() {
    return LocalServiceRegistry.createService('shipperhq.service.rest', {

        createRequest: function (svc, requestObject) {
            // Initialize the configuration object.
            var configuration = Configuration.init();

            // Set standard headers
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('User-Agent', 'SalesforceB2CCommerce-ShipperHQ/19.10.0');

            // Set the request method based on the request object configuration.
            if (requestObject.httpMethod) {
                svc.setRequestMethod(requestObject.httpMethod);
            }

            // Set the request endpoint URL based on the request object configuration.
            if (requestObject.endpoint) {
                svc.setURL(svc.configuration.credential.URL + requestObject.endpoint);
            }

            // Passed request object or empty object if none exists.
            var requestBody = requestObject.payload || {};
            // Inject credentials into every API request per ShipperHQ documentation.
            requestBody.credentials = configuration.credentials;
            requestBody.siteDetails = configuration.siteDetails;

            return JSON.stringify(requestBody);
        },

        parseResponse: function (svc, httpClient) {
            var response = JSON.parse(httpClient.text);

            // Need to handle errors and throw up to caller

            return response;
        },

        mockCall: function () {
            return require('../mock/mock.json');
        },

        filterLogMessage: function (msg) {
            var filteredMsg = msg;
            var filter = function (targetObj, filterArray) {
                var filteredObject = targetObj;

                filterArray.forEach(function (attribute) {
                    if (targetObj[attribute] && typeof targetObj[attribute] === 'string') {
                        filteredObject[attribute] = targetObj[attribute].replace(/./g, '*');
                    }
                });

                return filteredObject;
            };

            if (dw.system.System.getInstanceType() === dw.system.System.PRODUCTION_SYSTEM && filteredMsg.indexOf('{') === 0) {
                try {
                    var requestObj = JSON.parse(filteredMsg);

                    if (!empty(requestObj)) {
                        if (requestObj.credentials) filter(requestObj.credentials, ['apiKey', 'password']);

                        if (requestObj.destination) filter(requestObj.destination, ['street', 'email', 'givenName', 'familyName', 'telNo']);

                        filteredMsg = JSON.stringify(requestObj);
                    }
                } catch (e) {
                    filteredMsg = 'Unable to parse the service request or response.';
                }
            }

            return filteredMsg;
        }
    });
}

/**
 * Retrieves HTTP service and executes call to the ShipperHQ REST API.
 *
 * @param {Object} requestObject Contains data for making REST API request.
 * @returns {Object} Response object from the REST API.
 */
function callService(requestObject) {
    if (!requestObject) throw new Error('Request object parameter required for API request.');

    var response;
    try {
        response = getShipperHQService().call(requestObject);
    } catch (e) {
        Logger.error('Error making ShipperHQ REST API request: {0}', e);
    }

    if (!response.ok) throw new Error('Error making REST API call: {0}.', response.errorMessage);

    return response;
}

/**
 * ShipperHQ function declaration.
 */
function ShipperHQ() {

}

/**
 * ShipperHQ '/attributes/*' endpoints with corresponding request data.
 */
ShipperHQ.prototype.attributes = {
    get: function () {
        var requestObject = {
            endpoint: '/attributes/get',
            httpMethod: 'POST'
        };

        return callService(requestObject);
    },
    check: function () {
        var requestObject = {
            endpoint: '/attributes/check',
            httpMethod: 'POST'
        };

        return callService(requestObject);
    },
    update: function (requestPayload) {
        var requestObject = {
            endpoint: '/attributes/set/updated',
            httpMethod: 'POST',
            payload: requestPayload
        };

        return callService(requestObject);
    }
};

/**
 * ShipperHQ '/allowed_methods' endpoint with corresponding request data.
 */
ShipperHQ.prototype.methods = {
    list: function () {
        var requestObject = {
            endpoint: '/allowed_methods',
            httpMethod: 'POST'
        };

        return callService(requestObject);
    }
};

/**
 * ShipperHQ '/rates' endpoint with corresponding request data.
 */
ShipperHQ.prototype.rates = {
    retrieve: function (requestPayload) {
        var requestObject = {
            endpoint: '/rates',
            httpMethod: 'POST',
            payload: requestPayload
        };

        return callService(requestObject);
    }
};

module.exports = ShipperHQ;
