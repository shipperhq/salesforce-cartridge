'use strict';

var XMLStreamWriter = function () {
    this.defaultNamespace = null;
};

XMLStreamWriter.prototype.writeStartDocument = function () {};
XMLStreamWriter.prototype.writeEndDocument = function () {};
XMLStreamWriter.prototype.flush = function () {};
XMLStreamWriter.prototype.close = function () {};
XMLStreamWriter.prototype.writeStartElement = function () {};
XMLStreamWriter.prototype.writeAttribute = function () {};
XMLStreamWriter.prototype.writeEndElement = function () {};
XMLStreamWriter.prototype.writeCharacters = function () {};

module.exports = XMLStreamWriter;
