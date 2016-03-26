/**
 * Created by vestnik on 26/03/16.
 */
// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')
var entries = require('object.entries')
if (!Object.entries) {
  entries.shim()
}
// require all test files (files that ends with .spec.js)
var testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
var srcContext = require.context('../../src', true, /^\.\/(?!vue\-localize(\.js)?$)/)
srcContext.keys().forEach(srcContext)