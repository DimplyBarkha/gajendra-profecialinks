const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AT',
        store: '0815',
        transform: cleanUp,
        domain: '0815.at',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(() => {
            const div = document.evaluate("//div[contains(@class,'product-detail-buy')]//div[contains(@class,'custom-price-style') and not (contains(@class,'instead'))]", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
            div.innerText = div.innerText.replace(",", ".").replace("\n", "")
        });

        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    }
};