'use strict';

/* API Includes */
var Logger = require('dw/system/Logger').getLogger('ShipperHQ', 'service');
var Status = require('dw/system/Status');
var StringUtils = require('dw/util/StringUtils');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');

/* Local Includes */
var ShipperHQ = require('*/cartridge/scripts/services/rest');

/**
 * Processes the REST API response into an object for writing Salesforce B2C Commerce XML file.
 *
 * @param {Object} carrierMethods REST API response with allowed carrier methods.
 * @returns {Object} Object containing processed ShipperHQ allowed methods.
 */
function processCarrierMethods(carrierMethods) {
    var methods = [];

    for (var i = 0; i < carrierMethods.length; i++) {
        var carrier = carrierMethods[i];

        for (var j = 0; j < carrier.methods.length; j++) {
            var method = carrier.methods[j];

            methods.push({
                id: carrier.carrierCode + '_' + method.methodCode,
                taxClassId: 'standard',
                displayName: StringUtils.encodeString(method.name, StringUtils.ENCODE_TYPE_XML)
            });
        }
    }

    return methods;
}

/**
 * Retrieve allowed methods from ShipperHQ REST API.
 *
 * @returns {Object} Object containing processed ShipperHQ allowed methods.
 */
function getAllowedMethods() {
    var shipperHQ = new ShipperHQ();
    var response = shipperHQ.methods.list();

    return processCarrierMethods(response.object.carrierMethods);
}

/**
 * Writes shipping method elements to XML file.
 *
 * @param {dw.io.XMLStreamWriter} xsw Class used to write XML to file.
 * @param {Object} method Object containing processed allowed methods.
 */
function writeMethod(xsw, method) {
    /* eslint-disable indent */
    xsw.writeStartElement('shipping-method');
    xsw.writeAttribute('method-id', method.id);
    xsw.writeAttribute('default', 'false');
        xsw.writeStartElement('display-name');
            xsw.writeCharacters(method.displayName);
        xsw.writeEndElement();
        xsw.writeStartElement('tax-class-id');
            xsw.writeCharacters(method.taxClassId);
        xsw.writeEndElement();
        xsw.writeStartElement('price-table');
            xsw.writeStartElement('amount');
            xsw.writeAttribute('order-value', '0');
                xsw.writeCharacters('0');
            xsw.writeEndElement();
        xsw.writeEndElement();
        xsw.writeStartElement('custom-attributes');
            xsw.writeStartElement('custom-attribute');
            xsw.writeAttribute('attribute-id', 'shipperHQRates');
                xsw.writeCharacters('true');
            xsw.writeEndElement();
        xsw.writeEndElement();
    xsw.writeEndElement();
    /* eslint-enable indent */
}

/**
 * Writes shipping and method elements to XML file.
 *
 * @param {dw.io.XMLStreamWriter} xsw Class used to write XML to file.
 * @param {Object} methods Object containing processed allowed methods.
 */
function writeElements(xsw, methods) {
    xsw.writeStartElement('shipping');
    xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/shipping/2007-03-31');

    for (var i = 0; i < methods.length; i++) {
        writeMethod(xsw, methods[i]);
    }
    xsw.writeEndElement();
}

/**
 * Opens XML stream and writes methods to it
 * @param {string} filePath the path of the shipping-method-xml
 * @param {Object} methods Object containing processed allowed methods.
 * @returns {dw.system.Status} Status of write operation
 */
function writeShippingMethodsToFile(filePath, methods) {
    var path = filePath;
    path = path.replace(/\{timestamp\}/ig, Date.now());
    path = path.replace(/\{date\}/ig, (new Date()).toISOString().split('T')[0]);
    path = path.replace(/\{siteID\}/ig, require('dw/system/Site').getCurrent().getID());

    // default options before filePath
    var fileName = File.IMPEX + File.SEPARATOR + path;

    var file;
    try {
        file = new File(fileName);
        (new File(file.fullPath.substr(0, file.fullPath.lastIndexOf(File.SEPARATOR)))).mkdirs();
        file.createNewFile();

        if (!file || !file.exists()) {
            throw new Error('Error creating file');
        }
    } catch (e) {
        Logger.error('Error creating file with file name ' + fileName, e);
        return new Status(Status.ERROR);
    }


    var writer;
    try {
        writer = new FileWriter(file, 'UTF-8');
    } catch (e) {
        Logger.error('Error creating file writer with file ' + file.name, e);
        return new Status(Status.ERROR);
    }


    var xmlWriter;
    try {
        xmlWriter = new XMLStreamWriter(writer);
    } catch (e) {
        Logger.error('Error creating xml file writer', e);
        writer.close();
        return new Status(Status.ERROR);
    }

    // in case writeElements throws error close file and writer
    try {
        xmlWriter.writeStartDocument('utf-8', '1.0');
        writeElements(xmlWriter, methods);
        xmlWriter.writeEndDocument();
    } catch (e) {
        Logger.error('Error writing shipping methods to xml file', e);
        xmlWriter.flush();
        xmlWriter.close();
        writer.close();
        return new Status(Status.ERROR);
    }

    // Close XML document
    xmlWriter.flush();
    xmlWriter.close();
    writer.close();

    // Assume by this point everything is okay and it has written
    return new Status(Status.OK);
}

/**
 * Writes ShipperHQ allowed methods to XML file for import.
 *
 * @param {Object} methods Object containing processed allowed methods.
 * @returns {dw.system.Status} Status of write operation via xmlStreamWriter.
 */
function writeFile(methods) {
    var filePath = 'src/shipperhq/{siteID}/shipping-methods-{timestamp}.xml';

    var status = writeShippingMethodsToFile(filePath, methods);

    return status;
}

/**
 * Entry point function for custom.ShipperHQ-MethodSync job step that retrieves the allowed shipping methods
 * from the ShipperHQ REST API, then writes them to a file in Salesforce B2C Commerce format for import.
 *
 * @returns {dw.system.Status} Job script exit status.
 */
function sync() {
    var methods;
    try {
        methods = getAllowedMethods();
    } catch (e) {
        Logger.error('Error retrieving allowed methods from ShipperHQ: {0}', e);
        return new Status(Status.ERROR);
    }

    var result;
    try {
        result = writeFile(methods);
    } catch (e) {
        Logger.error('Error writing ShipperHQ allowed methods to file: {0}', e);
        return new Status(Status.ERROR);
    }

    return result;
}

exports.sync = sync;
