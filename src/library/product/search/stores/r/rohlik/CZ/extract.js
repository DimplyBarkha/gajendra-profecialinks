const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'CZ',
        store: 'rohlik',
        transform,
        domain: 'rohlik.cz',
        zipcode: '',
    },
    // implementation: async function(
    //     inputs,
    //     parameters,
    //     context,
    //     dependencies,
    // ) {
    //     const { productDetails } = dependencies;
    //     const { transform } = parameters;

    //     await context.waitForSelector(('a[class*="imgWrapper"]'), { timeout: 100000 });

    //     return await context.extract(productDetails, { transform });
    // }
};