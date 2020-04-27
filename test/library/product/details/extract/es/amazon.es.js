describe("product/details/extract/es/amazon.es", function() {
    const action = require('@library/product/details/extract/es/amazon.es');
    const chai = require('chai');
    it("happy path", async function() {
        await action.implementation(inputs, parameters, context, dependencies);
    });
});