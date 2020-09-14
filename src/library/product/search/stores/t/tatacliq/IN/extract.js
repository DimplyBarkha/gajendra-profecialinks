const { transform } = require('../../../../shared')
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        transform,
        domain: 'tatacliq.com',
        zipcode: '',
    },

    implementation: async function implementation(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const timeout = 50000;

        const req = await context.searchForRequest('searchText=.*');
        const pageData = JSON.parse(req.responseBody.body);
        const searchResults = pageData.searchresult;

        await context.evaluate(function (results) {
            results.forEach(s => {
                const sel = `#ProductModule-${s.productId} > div > a`;
                const el = document.querySelector(sel);
                el.setAttribute('imageUrl', `https:${s.imageURL}`);
            });
        }, searchResults);

        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });


    },
};