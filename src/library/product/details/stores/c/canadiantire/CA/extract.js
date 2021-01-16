const { transform } = require('../format')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'CA',
        store: 'canadiantire',
        transform,
        domain: 'canadiantire.ca',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.evaluate(async() => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
        return await context.extract(productDetails, { transform });
    }
};