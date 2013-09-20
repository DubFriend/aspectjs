(function () {
    'use strict';
    var _ = require('underscore'),
        requirejs = require('requirejs');

    requirejs.config({
        nodeRequire: require
    });

    var aspect = requirejs('aspect.js');

    //memo, log, profile, custom

    var data,
        defaultAspect = aspect({
            custom: function (input, output, ctx) {
                data = { in: input, out: output, this: ctx };
            }
        }),

        assertionPackage = function (test, fig) {
            test.deepEqual(fig.fn(fig.in), fig.expectedFunctionOutput, 'normal functionality works');
            test.deepEqual(data.in[0], fig.expectedAspectInput, 'receives input');
            test.deepEqual(data.out, fig.expectedAspectOutput, 'receives output');
            test.deepEqual(data.this, fig.expectedAspectContext, 'receives context');
        };

    exports.test = {
        setUp: function (done) {
            data = undefined;
            done();
        },

        testCustomSimple: function (test) {
            assertionPackage(test, {
                fn: defaultAspect(function (a) {
                    return a + this.three;
                }, { three: 3 }),
                in: 2,
                expectedFunctionOutput: 5,
                expectedAspectInput: 2,
                expectedAspectOutput: 5,
                expectedAspectContext: { three: 3 }
            });
            test.done();
        },

        testCustomFunctionDeepMutatesInput: function (test) {
            assertionPackage(test, {
                fn: defaultAspect(function (obj) {
                    obj.a += 1;
                    return obj.a + this.three;
                }, { three: 3 }),
                in: { a: 1 },
                expectedFunctionOutput: 5,
                expectedAspectInput: { a: 1 },
                expectedAspectOutput: 5,
                expectedAspectContext: { three: 3 }
            });
            test.done();
        }//,
        //testCustomAspectDeepMutatesInput: function (test) {}
        //,testCustomFunctionDeepMutatesContext: function (test) {}
        //,testCustomAspectDeepMutatesContext: function (test) {}
    };

}());
