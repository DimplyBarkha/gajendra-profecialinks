describe("gotourl/es/amazon.es", function() {
    const action = require('@library/gotourl/es/amazon.es');
    const chai = require('chai');
    it("happy path", async function() {
        await action.implementation(inputs, parameters, context, dependencies);
    });
});