const { transform } = require('../../../../shared')
module.exports = {
    implements: 'product/search/extract',
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
        // const result = await context.evaluate(() => {
        //     return document.querySelector('#root>div>div:nth-child(4)>div')
        // })
        // if (result) {
        //     await context.waitForFunction(() => {
        //         return !document.querySelector('#root>div>div:nth-child(4)>div')
        //     }, 50000)
        // }

        await context.evaluate(() => {
            document.querySelector('div#grid-wrapper_desktop>div>div>div>div>div:last-child').scrollIntoView({ behavior: "smooth" })
        })
        await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });

        try {
            await context.waitForSelector("div[id='grid-wrapper_desktop']>div>div>div>div>div:last-child>div:last-child", 80000)
        } catch (e) {
            console.log(e);
        }

        const { transform } = parameters;
        const { productDetails } = dependencies;
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        await delay(7000);
        return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });


    },
};