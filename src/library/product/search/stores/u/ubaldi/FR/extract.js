async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    context.evaluate(() => {

        for (let i = 2; i < 90; i++) {
            if (((i - 1) % 30) == 0) i = i + 1;
            try {
                const selector = '.la-article:nth-child(' + i + ') .la-visuel .la-image-container .img-placeholder a img'
                const x = document.querySelector(selector);
                const source = x.getAttribute('src');
                if (source) {
                    document.querySelector(selector).setAttribute('data-src', source);
                    console.log('Done\n')
                }
            } catch (e) {
                console.log(e);
            }
        }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
}
const { transform } = require('../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        transform,
        domain: 'ubaldi.com',
        zipcode: '',
    },
    implementation,
};