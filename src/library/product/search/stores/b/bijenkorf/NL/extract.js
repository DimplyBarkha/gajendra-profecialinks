const { transform } = require('../NL/shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
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
                }, 50);
            });
        });
    }
    await autoScroll(context);
    if (await context.evaluate(() => { return !document.evaluate('//div[contains(@class,"dbk-search-empty")]', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue })) {
        return await context.extract(productDetails, { transform });
    }
}

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'NL',
        store: 'bijenkorf',
        transform,
        domain: 'bijenkorf.nl',
        zipcode: '',
    },
    implementation,
};