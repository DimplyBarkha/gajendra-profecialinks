const { transform } = require('./transform');

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'MX',
        store: 'innovasport',
        transform,
        domain: 'innovasport.com',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { productDetails } = dependencies;
        const { transform } = parameters;
        await context.evaluate(() => {
            var searchUrl = window.location.href;
            var appendElements = document.querySelectorAll('div[class="is-pw__product"]');
            if (appendElements.length) {
                appendElements.forEach((element) => {
                    element.setAttribute('searchurl', searchUrl);
                })
            }
            const nextLinkElement = document.querySelector('head link[rel="next"]');
            if (nextLinkElement) {
            nextLinkElement.remove();
            }
        });

        return await context.extract(productDetails, { transform });
    }
};