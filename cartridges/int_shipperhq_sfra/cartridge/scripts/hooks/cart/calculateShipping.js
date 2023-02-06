'use strict';

/* API Includes */
var Logger = require('dw/system/Logger').getLogger('ShipperHQ', 'service');
var ShippingLineItem = require('dw/order/ShippingLineItem');
var ShippingMgr = require('dw/order/ShippingMgr');
var Status = require('dw/system/Status');
var Site = require('dw/system/Site');

/* Local Includes */
var collections = require('*/cartridge/scripts/util/collections');
var ratesHelper = require('*/cartridge/scripts/helpers/ratesHelper');

/**
 * Determines if the shipment is eligible and shipping method should use ShipperHQ rates.
 *
 * @param {dw.order.Shipment} shipment Shipment to test for eligibility.
 * @return {boolean} Eligibility result.
 */
function updateEligibleShipment(shipment) {
    if (!shipment || !shipment.shippingAddress) return false;

    if (!shipment.shippingMethod || !shipment.shippingMethod.ID) return false;

    if (!ratesHelper.isShipperHQShippingMethod(shipment.shippingMethod)) return false;

    return true;
}

/**
 *  Determines if the shipping rate is valid for use.
 *
 * @param {Object} shippingCost Rate candidate cost object.
 * @returns {boolean} Test result.
 */
function validShippingCost(shippingCost) {
    var valid = shippingCost && shippingCost.amount;

    if (!valid) {
        Logger.warn('Shipping rate unavailable for the selected ShipperHQ shipping method.');
    }

    return valid;
}

/**
 * Updates the shipping line item (SLI) based on the rate object.
 *
 * @param {dw.order.ShippingLineItem} shippingLineItem Shipping charge line item to update.
 * @param {Object} shippingCost Rate object to use for the SLI update.
 */
function updateShippingLineItem(shippingLineItem, shippingCost) {
    shippingLineItem.setPriceValue(shippingCost.amount.value);
}

/**
 * Updates the shipment when eligible and valid rate available.
 *
 * @param {dw.order.Shipment} shipment Shipment object to update.
 */
function updateShipment(shipment) {
    if (updateEligibleShipment(shipment)) {
        var lineItemContainer = this;
        var shippingCost = ratesHelper.getShippingCost(shipment.shippingMethod, shipment, shipment.shippingAddress, lineItemContainer.customer);
        var shippingLineItem = shipment.getShippingLineItem(ShippingLineItem.STANDARD_SHIPPING_ID);

        if (validShippingCost(shippingCost)) {
            updateShippingLineItem(shippingLineItem, shippingCost);
        }
    }
}

/**
 * Applies shipping rates to eligible line item container shipments.
 *
 * @param {dw.order.lineItemContainer} lineItemContainer Line item container with shipments to update.
 */
function applyShipperHQRate(lineItemContainer) {
    collections.forEach(lineItemContainer.shipments, updateShipment, lineItemContainer);
}

/**
 * Hook method that applies product and shipment-level shipping cost to the specified line item container,
 * applying external rates where applicable.
 *
 * @param {dw.order.lineItemContainer} lineItemContainer Line item container with shipments to update.
 * @returns {dw.system.Status} Status of the update.
 */
function calculateShipping(lineItemContainer) {
    // Execute the native shipping manager logic to create shipping line items.
    ShippingMgr.applyShippingCost(lineItemContainer);

    if (Site.current.getCustomPreferenceValue('ShipperHQEnabled')) {
        // Apply rate updates where appropriate.
        applyShipperHQRate(lineItemContainer);
    }

    return new Status(Status.OK);
}

exports.calculateShipping = calculateShipping;
