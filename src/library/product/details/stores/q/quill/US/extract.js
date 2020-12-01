module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'quill',
        transform: null,
        domain: 'quill.com',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(async() => {
            if (document.querySelector('div[id*="PopUp"]')) {
                try { document.querySelector('img[title*="Close Message"]').click(); } catch (e) { console.error(e); }
            }
        });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};