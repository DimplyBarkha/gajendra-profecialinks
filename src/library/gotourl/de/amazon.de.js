module.exports = {
    implements: "gotourl",
    implementation: async ({ url }, { country, domain }, context, dependencies) => {
        throw new Error('No implementation - remove this file to use default implementation');
    }
}