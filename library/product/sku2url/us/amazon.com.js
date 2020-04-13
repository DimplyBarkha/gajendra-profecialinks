module.exports = {
    implements: "product/sku2url",
    implementation: async ({ sku }, { country, domain }, context, dependencies) => {
        return `https://www.amazon.com/dp/${sku}`;
    }
}