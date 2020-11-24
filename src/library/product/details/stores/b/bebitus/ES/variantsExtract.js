const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/variants/variantsExtract',
    parameterValues: {
        country: 'ES',
        store: 'bebitus',
        transform: cleanUp,
        domain: 'bebitus.com',
        zipcode: '',
    },
    implementation: async function implementation(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { transform } = parameters;
        const { variants } = dependencies;
        const isVariants = await context.evaluate(() => {
            return document.querySelector('.product-variants');
        });
        if (isVariants) {
            const currentUrl = await context.evaluate(() => {
                return window.location.href;
            })
            await context.evaluate((currentUrl) => {
                const url = currentUrl.split('?')[0];
                // @ts-ignore
                const eans = [...document.querySelectorAll('div[class*="shipping-detail"] ~ input')];
                const body = document.querySelector('body');
                eans.forEach(ean => {
                    const url1 = url + '?selectedean=' + ean.getAttribute('value');
                    const div = document.createElement('div');
                    div.className = 'variants-url';
                    div.innerText = url1;
                    body.append(div);
                })
            }, currentUrl)
        } else {
            await context.evaluate(() => {
                const url = document.querySelector('meta[property="og:url"]').getAttribute('content');
                const body = document.querySelector('body');
                const div = document.createElement('div');
                div.className = 'variants-url';
                div.innerText = url;
                body.append(div);
            })
        }
        return await context.extract(variants, { transform });
    },
};