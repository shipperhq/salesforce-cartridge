'use strict';

var File = function () {
    this.fullPath = '/IMPEX/src/shipperhq/RefArch/shipping-methods-123456.xml';
};

File.prototype.mkdirs = function () {
    return {
        directory: false,
        file: false,
        fullPath: '/IMPEX/src/shipperhq/RefArch/shipping-methods-123456.xml',
        name: 'shipping-methods-123456.xml',
        path: 'src/shipperhq/RefArch/shipping-methods-123456.xml',
        rootDirectoryType: 'IMPEX',
        fileName: 'IMPEX/src/shipperhq/RefArch/shipping-methods-123456.xml',
        filePath: 'src/shipperhq/RefArch/shipping-methods-123456.xml'
    };
};

File.prototype.createNewFile = function () {
    return {
        directory: false,
        file: false,
        fullPath: '/IMPEX/src/shipperhq/RefArch/shipping-methods-123456.xml',
        name: 'shipping-methods-123456.xml',
        path: 'src/shipperhq/RefArch/shipping-methods-123456.xml',
        rootDirectoryType: 'IMPEX',
        fileName: 'IMPEX/src/shipperhq/RefArch/shipping-methods-123456.xml',
        filePath: 'src/shipperhq/RefArch/shipping-methods-123456.xml'
    };
};

File.prototype.exists = function () {
    return true;
};


module.exports = File;
