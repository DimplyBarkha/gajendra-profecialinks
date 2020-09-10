// const { transform } = require('../../../../shared')
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        transform: null,
        domain: 'tatacliq.com',
        zipcode: '',
    },

    implementation: async function implementation(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
    },
};