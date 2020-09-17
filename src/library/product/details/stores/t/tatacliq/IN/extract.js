const { transform } = require('./transform')
module.exports = {
    implements: 'product/details/extract',
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
        const { transform } = parameters;
        const { productDetails } = dependencies;
        const currentSelector = '#root > div > div._3Zwp_xfvys_Gl6iCn51uE6 > div > div._3nEIAVs5PpLHjQeCmVTJ3h > div > div:nth-child(1) > div > div:nth-child(5) > div._273qboblakntZlD2M6BaZC > div > h2';
        const result = await context.evaluate((currentSelector) => {
            return Boolean(document.querySelector(currentSelector));
        }, currentSelector);

        if (result) {
            await context.click('#root > div > div._3Zwp_xfvys_Gl6iCn51uE6 > div > div._3nEIAVs5PpLHjQeCmVTJ3h > div > div:nth-child(1) > div > div:nth-child(5) > div._273qboblakntZlD2M6BaZC > div > h2');
            // await context.waitForNavigation({ timeout: 20000, waitUntil: 'load' });

            await context.click('#root > div > div._3Zwp_xfvys_Gl6iCn51uE6 > div > div._3nEIAVs5PpLHjQeCmVTJ3h > div > div:nth-child(1) > div > div:nth-child(5) > div.ReactCollapse--collapse > div > div > div:nth-child(2) > div > span')
                // await context.waitForNavigation({ timeout: 20000, waitUntil: 'load' });

        }
        await context.waitForSelector(('#root > div > div._3Zwp_xfvys_Gl6iCn51uE6 > div > div._3nEIAVs5PpLHjQeCmVTJ3h > div > div:nth-child(1) > div > div:nth-child(5) > div.ReactCollapse--collapse > div > div > div:nth-child(2) > div > span'), 50000);
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        await delay(5000);
        return await context.extract(productDetails, { transform });
    }

};