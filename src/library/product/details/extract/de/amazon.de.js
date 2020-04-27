module.exports = {
    implements: "product/details/extract",
    implementation: async ({  }, { country, domain }, context, dependencies) => {
        throw new Error('No implementation - remove this file to use default implementation');
    }
}