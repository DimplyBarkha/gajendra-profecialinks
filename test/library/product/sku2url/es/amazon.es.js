describe("product/sku2url/es/amazon.es", function() {
    const action = require('@library/product/sku2url/es/amazon.es');
    const chai = require('chai');
    it("happy path", async function() {
        await action.implementation(inputs, parameters, context, dependencies);
    });
});