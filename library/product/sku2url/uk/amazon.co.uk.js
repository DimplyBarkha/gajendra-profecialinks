module.exports = {
    implements: "product/sku2url",
    implementation: async ({ sku }, { country, domain }, context, dependencies) => {
        return `https://www.amazon.co.uk/dp/${sku}`;
    }
}