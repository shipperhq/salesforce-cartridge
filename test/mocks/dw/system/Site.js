var Site = function () {};

Site.current = function () {
    return new Site();
};

Site.current.getCustomPreferenceValue = function (prefName) {
    var testScope = {
        value: 'LIVE'
    };

    if (prefName === 'ShipperHQEnabled') {
        return true;
    } else if (prefName === 'ShipperHQApiKey') {
        return '12345678';
    } else if (prefName === 'ShipperHQPassword') {
        return 'MyPassword';
    } else if (prefName === 'ShipperHQScope') {
        return testScope;
    }
    return true;
};


Site.getCurrent = function () {
    return {
        getID: function () {
            return '123';
        },
        httpsHostName: 'ShipperHQ.com'
    };
};

module.exports = Site;
