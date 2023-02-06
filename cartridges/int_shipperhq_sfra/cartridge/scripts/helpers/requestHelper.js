'use strict';

/* Local Includes */
var collections = require('*/cartridge/scripts/util/collections');
var ArrayList = require('dw/util/ArrayList');

var customAttributeMap = {
    shipHeight: 'ship_height',
    shipLength: 'ship_length',
    shipWidth: 'ship_width',
    shipWeight: 'weight',
    shipperHQDimGroups: 'shipperhq_dim_group',
    shipperHQShippingFee: 'shipperhq_shipping_fee',
    shipperHQShippingGroups: 'shipperhq_shipping_group',
    shipperHQHSCode: 'shipperhq_hs_code',
    shipperHQWarehouses: 'shipperhq_warehouse'
};

/**
 * Deteremines the ShipperHQ product type based on the SFCC product data.
 *
 * @param {dw.catalog.Product} product SFCC API product.
 * @returns {string} ShipperHQ product type.
 */
function getProductType(product) {
    var result;
    if (product.master || product.variationGroup) {
        result = 'configurable';
    } else if (product.bundle) {
        result = 'bundle';
    } else {
        result = 'simple';
    }
    return result;
}

/**
 * Accepts an array of values and concates them into a comma separated string.
 *
 * @param {Object} array Array of values.
 * @returns {string} Comma separated list of array values.
 */
function prepareArrayValue(array) {
    var rawValue = (typeof array === 'object') ? array : [];

    return rawValue.join('#');
}

/**
 * Accepts a number and formats to a fixed number of decimal places.
 *
 * @param {number} number Number to format.
 * @returns {number} Number formated to 4 decimal places.
 */
function prepareNumberValue(number) {
    var rawValue = (typeof number === 'number') ? number : 0;

    return rawValue.toFixed(4);
}

/**
 * Accepts a string and formats appropriately.
 *
 * This method is primarily included to maintain the pattern used for other data types.
 *
 * @param {string} string String to format.
 * @returns {string} Formatted string.
 */
function prepareStringValue(string) {
    var rawValue = (typeof string === 'string') ? string : '';

    return rawValue;
}

/**
 * Decorates the item payload with custom attributes, formatted for use in the API.
 *
 * @param {Object} item Payload item to decorate.
 * @param {dw.catalog.Product} product Data source.
 * @param {string} attributeName Custom attribute to map to the payload body.
 * @param {Function} prepareCallback Function to format the custom attribute value.
 */
function decorateWithCustomAttribute(item, product, attributeName, prepareCallback) {
    // Product custom attribute value
    var productAttributeValue = product.custom[attributeName];
    // SHQ item attribute name mapped from SFCC to SHQ
    var itemAttributeName = customAttributeMap[attributeName];

    // If attribute is valid per the mapping and has a value,
    // add it to the SHQ attributes array.
    // stop enum of strings from coming through so check length
    if (productAttributeValue && (!empty(productAttributeValue) || typeof productAttributeValue === 'number') && itemAttributeName) {
        item.attributes.push({
            name: itemAttributeName,
            value: prepareCallback(productAttributeValue)
        });
    }
}

/**
 * Takes in the product and process attributes accordingly for SHQ request
 * @param {dw.catalog.Product} product Data source.
 * @param {Object} item Data source.
 */
function processAttributes(product, item) {
            // Process the numeric custom attributes and add them to the 'attributes' array on the item.
    ['shipHeight', 'shipLength', 'shipWidth', 'shipperHQShippingFee'].forEach(function (attributeName) {
        decorateWithCustomAttribute(item, product, attributeName, prepareNumberValue);
    });

            // Process the list custom attributes and add them to the 'attributes' array on the item.
    ['shipperHQDimGroups', 'shipperHQShippingGroups', 'shipperHQWarehouses'].forEach(function (attributeName) {
        decorateWithCustomAttribute(item, product, attributeName, prepareArrayValue);
    });

            // Process the string custom attributes and add them to the 'attributes' array on the item.
    ['shipperHQHSCode'].forEach(function (attributeName) {
        decorateWithCustomAttribute(item, product, attributeName, prepareStringValue);
    });
}

/**
 * Product Line Item values are used on Simple Products, Product Bundles, and Bundle Products
 * Variants utilize pli (child item) info everywhere except parent item sku, id weight, and attributes so we pass in null product to signify.
 * @param {dw.order.ProductLineItem} pli ProductLineItem
 * @param {dw.catalog.Product} product Product allows me to use passed in product
 * @returns {Object} cart Item
 */
function buildItem(pli, product) {
    var lineItemProduct = product;
    if (!lineItemProduct) {
        lineItemProduct = pli.product;
    }

    var productType = getProductType(lineItemProduct);

    // Builds up SHQ item either using pli or masterProduct values
    var item = {
        id: lineItemProduct.UUID,
        sku: lineItemProduct.ID,
        storePrice: pli.priceValue,
        weight: prepareNumberValue(lineItemProduct.custom.shipWeight),
        qty: pli.quantityValue,
        type: productType,
        items: [],
        basePrice: pli.basePrice.value,
        taxInclBasePrice: pli.basePrice.value + pli.tax.value,
        taxInclStorePrice: pli.basePrice.value + pli.tax.value,
        rowTotal: pli.adjustedGrossPrice.value,
        baseRowTotal: pli.adjustedGrossPrice.value,
        discountPercent: null,
        discountedBasePrice: pli.adjustedPrice.value,
        discountedStorePrice: pli.adjustedPrice.value,
        discountedTaxInclBasePrice: pli.adjustedGrossPrice.value,
        discountedTaxInclStorePrice: pli.adjustedGrossPrice.value,
        attributes: [],
        baseCurrency: pli.basePrice.currencyCode === 'N/A' ? 'USD' : pli.basePrice.currencyCode,
        packageCurrency: pli.basePrice.currencyCode === 'N/A' ? 'USD' : pli.basePrice.currencyCode,
        storeBaseCurrency: pli.basePrice.currencyCode === 'N/A' ? 'USD' : pli.basePrice.currencyCode,
        storeCurrentCurrency: pli.basePrice.currencyCode === 'N/A' ? 'USD' : pli.basePrice.currencyCode,
        taxPercentage: (pli.taxRate * 100),
        freeShipping: false,
        additionalAttributes: [],
        fixedPrice: false, // only reference in logic is for bundle item usage
        fixedWeight: false // only reference in logic is for bundle item usage
    };

    // Process the numeric custom attributes and add them to the 'attributes' array on the item.
    processAttributes(lineItemProduct, item);

    return item;
}

/**
 * Determines what values to take to populate the child items within buildItem properly. Returns empty list
 * if pli structure is outside of main ones that I have seen and tested with
 * @param {dw.order.ProductLineItem} pli product line item
 * @returns {dw.util.Collection|dw.util.ArrayList} returns a collection of pli's
 */
function getChildItems(pli) {
    var lineItem = pli; // set as variable to avoid reference error

    if (lineItem.product.variant) {
        return new ArrayList(lineItem);
    } else if (lineItem.bundledProductLineItems) {
        return lineItem.bundledProductLineItems;
    }
    return new ArrayList();
}


/**
 * Takes the product line item and builds according to if it is simple, bundle, or variant item and
 * @param {dw.order.ProductLineItem} pli Product
 * @returns {Object} Item request object.
 */
function buildPayload(pli) {
    var product = pli.product && pli.product.variant ? pli.product.masterProduct : pli.product;

    var item = buildItem(pli, product);
    item.items = collections.map(getChildItems(pli), function (lineItem) { return buildItem(lineItem, null); });
    // we pass in parent item by default,
    return item;
}

/**
 * Builds out the basket product line items payload based on the shipment.
 *
 * @param {dw.order.Shipment} shipment Shipment to rate.
 * @returns {Object} Items request object.
 */
function buildItemsPayload(shipment) {
    if (!shipment) throw new Error('Shipment is required for the ShipperHQ rates request.');

    var requestItems = {
        declaredValue: shipment.adjustedMerchandizeTotalPrice.value,
        freeShipping: shipment.adjustedMerchandizeTotalPrice.value === 0,
        items: collections.map(shipment.productLineItems, buildPayload)
    };

    return requestItems;
}

/**
 * Builds out the basket destination payload based on shipping address.
 *
 * @param {dw.order.Address} address Address to rate.
 * @returns {Object} Destination request object.
 */
function buildDestinationPayload(address) {
    if (!address) throw new Error('Shipping address is required for the ShipperHQ rates request.');

    return {
        country: address.countryCode ? address.countryCode.value : null,
        region: (address.countryCode && address.countryCode.value === 'US') ? address.stateCode.value : null,
        city: address.city || null,
        street: address.address1 || null,
        street2: address.address2 || null,
        zipcode: address.postalCode || null,
        accessorials: null,
        selectedOptions: {
            options: []
        },
        email: null,
        givenName: null,
        familyName: null,
        companyName: null,
        telNo: null
    };
}

/**
 * Build out the basket customer payload based on customer.
 *
 * @param {dw.customer.Customer} customer Customer to rate.
 * @returns {Object} Customer details request object.
 */
function buildCustomerDetailsPayload(customer) {
    var customerDetails = {};

    if (customer && customer.customerGroups) {
        customerDetails.customerGroup = collections.pluck(customer.customerGroups, 'ID').join(',');
    }

    return customerDetails;
}

/**
 * Builds out the request payload, including shipment, address, and customer information.
 *
 * @param {dw.order.Shipment} shipment Shipment to rate.
 * @param {dw.order.Address} address Address to rate.
 * @param {dw.customer.Customer|null} customer Customer to rate.
 * @returns {Object} Request payload object.
 */
function getRequestPayload(shipment, address, customer) {
    var payload = {
        carrierCode: null,
        carrierId: null,
        carrierGroupId: null,
        cart: buildItemsPayload(shipment),
        cartType: 'STD',
        customerDetails: buildCustomerDetailsPayload(customer),
        deliveryDate: null,
        deliveryDateUTC: null,
        destination: buildDestinationPayload(address),
        shipDetails: null
    };

    return payload;
}

module.exports.getRequestPayload = getRequestPayload;
