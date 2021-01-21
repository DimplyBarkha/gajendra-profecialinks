const { transform } = require('./transform');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'PL',
        store: 'mediamarkt',
        transform,
        domain: 'mediamarkt.pl',
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
            const searchUrl = window.location.href;
            const appendElements = document.querySelectorAll("a[class='b-ofr_headDataTitle']");
            if (appendElements.length) {
                appendElements.forEach((element) => {
                    element.setAttribute('searchurl', searchUrl);
                });
            }
        });

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
                    }, 500);
                });
            });
        }
        await autoScroll(context);
        return await context.extract(productDetails, { transform });
    },

};