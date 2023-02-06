'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var Site = require('../../../../mocks/dw/system/Site');


var configuration = proxyquire('../../../../../cartridges/int_shipperhq_sfra/cartridge/scripts/configuration', {
    'dw/system/Site': Site
});

describe('Configuration ShipperHQ', function () {
    describe('enabled', function () {
        it('Should return true since the site has been set up in order to use it', function () {
            assert.equal(configuration.enabled(), true);
        });
    });

    describe('init', function () {
        it('Should return proper settings for Shipperhq configuration settings based off of Site', function () {
            var configurationSettings = configuration.init();
            assert.equal(configurationSettings.credentials.apiKey, '12345678');
            assert.equal(configurationSettings.credentials.password, 'MyPassword');
            assert.equal(configurationSettings.sitePreferences.enabled, true);
        });
    });
});
