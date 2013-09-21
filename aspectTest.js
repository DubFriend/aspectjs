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

        testSimple: function (test) {
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

        testFunctionDeepMutatesInput: function (test) {
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
        },

        testAspectDeepMutatesInput: function (test) {
            var def = aspect({
                a: function (input) {
                    input[0].a += 1;
                },
                b: function (input) {
                    input[0].a += 1;
                    data = input;
                }
            });

            var fn = def(function (o) {});
            fn({ a: 1 });
            test.strictEqual(data[0].a, 2, 'input data unmutated');
            test.done();
        },

        testFunctionDeepMutatesContext: function (test) {
            var def = aspect({
                a: function (input, output, context) {
                    data = context;
                }
            });

            (def(function () {
                this.a += 1;
                data = this;
            }, { a: 1 })());

            test.strictEqual(data.a, 2, 'receives updated context');
            test.done();
        },

        testAspectDeepMutatesContext: function (test) {
            var def = aspect({
                a: function (input, output, context) {
                    context.a += 1;
                },
                b: function (input, output, context) {
                    data = context;
                }
            });

            var fnThis = (def(function () {
                return this;
            }, { a: 1 })());
            test.strictEqual(fnThis.a, 1, 'functions this is unmutated');
            test.strictEqual(data.a, 1, 'next aspect\'s this is unmutated');
            test.done();
        },

        testAspectDeepMutatesReturnValue: function (test) {
            var def = aspect({
                a: function (input, output, context) {
                    output.a += 1;
                },
                b: function (input, output, context) {
                    data = output;
                }
            });


            (def(function () {
                return { a: 1 };
            })());

            test.strictEqual(data.a, 1, 'output is unmutated');

            test.done();
        }
    };

}());
