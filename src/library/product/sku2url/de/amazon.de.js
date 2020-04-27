module.exports = {
    implements: "product/sku2url",
    implementation: async ({ sku }, { country, domain }, context, dependencies) => {
        throw new Error('No implementation - remove this file to use default implementation');
    }
}