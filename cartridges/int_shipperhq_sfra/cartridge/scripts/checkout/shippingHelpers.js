'use strict';

var base = module.superModule;

var collections = require('*/cartridge/scripts/util/collections');

var ShippingMgr = require('dw/order/ShippingMgr');

var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');

/** ShipperHQ START */
var ratesHelper = require('*/cartridge/scripts/helpers/ratesHelper');
/** ShipperHQ END */

// Public (class) static model functions

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @param {Object} [address] - optional address object
 * @returns {dw.util.Collection} an array of ShippingModels
 */
function getApplicableShippingMethods(shipment, address) {
    if (!shipment) return null;

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);

    var shippingMethods;
    if (address) {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);
    } else {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods();
    }

    /** ShipperHQ START */
    // Retrieve function to filter out ShipperHQ methods that do not have a corresponding rate
    var shipperHQFilter = ratesHelper.getShippingMethodFilter(shipment, address, customer);
    /** ShipperHQ END */

    // Filter out whatever the method associated with in store pickup
    var filteredMethods = [];
    collections.forEach(shippingMethods, function (shippingMethod) {
        /** ShipperHQ Edit START */
        if (!shipperHQFilter(shippingMethod) && !shippingMethod.custom.storePickupEnabled) {
            filteredMethods.push(new ShippingMethodModel(shippingMethod, shipment));
        }
        /** ShipperHQ Edit END */
    });

    return filteredMethods;
}

module.exports = {
    getShippingModels: base.getShippingModels,
    selectShippingMethod: base.selectShippingMethod,
    ensureShipmentHasMethod: base.ensureShipmentHasMethod,
    getShipmentByUUID: base.getShipmentByUUID,
    getAddressFromRequest: base.getAddressFromRequest,
    getApplicableShippingMethods: getApplicableShippingMethods
};
