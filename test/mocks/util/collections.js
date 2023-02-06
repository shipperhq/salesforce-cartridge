'use strict';

function map() {
    var args = Array.from(arguments);
    var list = args[0];
    var callback = args[1];
    if (list && Object.prototype.hasOwnProperty.call(list, 'toArray')) {
        list = list.toArray();
    }
    return list ? list.map(callback) : [];
}

function find() {
    var args = Array.from(arguments);
    var list = args[0];
    var callback = args[1];
    if (list && Object.prototype.hasOwnProperty.call(list, 'toArray')) {
        list = list.toArray();
    }
    return list ? list.find(callback) : null;
}

function forEach() {
    var args = Array.from(arguments);
    var list = args[0];
    var callback = args[1];
    var scope = args[2];
    if (list && Object.prototype.hasOwnProperty.call(list, 'toArray')) {
        list = list.toArray();
    }
    return list ? list.forEach(callback, scope) : null;
}

function every() {
    var args = Array.from(arguments);
    var list = args[0];
    var callback = args[1];
    if (list && Object.prototype.hasOwnProperty.call(list, 'toArray')) {
        list = list.toArray();
    }
    return list ? list.every(callback) : null;
}

function pluck(array, key) {
    return array.map(function (obj) {
        return obj[key];
    });
}

module.exports = {
    find: find,
    forEach: forEach,
    map: map,
    every: every,
    pluck: pluck
};
