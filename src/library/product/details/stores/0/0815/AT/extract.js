const { cleanUp } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
}
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AT',
        store: '0815',
        transform: cleanUp,
        domain: '0815.at',
        zipcode: '',
    },
    implementation,
};