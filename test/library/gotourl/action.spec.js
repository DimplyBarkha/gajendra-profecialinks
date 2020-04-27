
describe("gotourl", function() {
    const action = require('@library/gotourl/action');
    const chai = require('chai');
    it("happy path", async function() {
        await action.implementation(inputs, parameters, context, dependencies);
    });
});