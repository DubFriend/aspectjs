define(['underscore'], function (_) {
    'use strict';

    var deepCopy = function (o) {
        var copy;
        if(typeof o === 'object') {
            copy = _.isArray(o) || _.isArguments(o) ? [] : {};
            _.each(o, function (val, key) {
                copy[key] = typeof val === 'object' ? deepCopy(val) : val;
            });
        }
        else {
            copy = o;
        }
        return copy;
    };

    return function (aspects) {
        return function (fn, ctx) {
            return function () {
                var args = deepCopy(arguments);
                var ret = fn.apply(ctx, arguments);
                _.each(aspects, function (aspect) {
                    aspect(deepCopy(args), deepCopy(ret), deepCopy(ctx));
                });
                return ret;
            };
        };
    };
});
