const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ZA',
        store: 'dis-chem',
        transform: cleanUp,
        domain: 'dischem.co.za',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        async function autoScroll(page) {
            await page.evaluate(async() => {
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
        }
        await autoScroll(context);
        context.evaluate(async() => {
            const meta = document.querySelector('meta[itemprop="availability"]');
            if (meta.getAttribute('content') === 'https://schema.org/InStock') {
                meta.setAttribute('content2', 'In Stock');
            } else {
                meta.setAttribute('content2', 'Out Of Stock');
            }
        });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        if (await context.evaluate(() => { return (document.body.getAttribute('page') === 'search') })) {
            return;
        }
        return await context.extract(productDetails, { transform });
    },
};