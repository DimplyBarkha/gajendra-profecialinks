const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'CA',
        store: 'bestbuy',
        transform: transform,
        domain: 'bestbuy.ca/en-ca',
        zipcode: '',
    },
    implementation,
};
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
            await stall(500);
            scrollTop += 500;
            window.scroll(0, scrollTop);
            if (scrollTop === 10000) {
                await stall(500);
                break;
            }
        }
        function stall(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, ms);
            });
        }
    });
    return await context.extract(productDetails, { transform });
    //return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
