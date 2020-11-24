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
        // const isVariants = await context.evaluate(() => {
        //     return document.querySelector('.product-variants');
        // });
        // if (isVariants) {
        //     const currentUrl = await context.evaluate(() => {
        //         return window.location.href;
        //     })
        //     await context.evaluate((currentUrl) => {
        //         const url = currentUrl.split('?')[0];
        //         // @ts-ignore
        //         const eans = [...document.querySelectorAll('div[class*="shipping-detail"] ~ input')];
        //         const body = document.querySelector('body');
        //         eans.forEach(ean => {
        //             const url1 = url + '?selectedean=' + ean.getAttribute('value');
        //             const div = document.createElement('div');
        //             div.className = 'variants-url';
        //             div.innerText = url1;
        //             body.append(div);
        //         })
        //     }, currentUrl)
        // } else {
        //     await context.evaluate(() => {
        //         const url = document.querySelector('meta[property="og:url"]').getAttribute('content');
        //         const body = document.querySelector('body');
        //         const div = document.createElement('div');
        //         div.className = 'variants-url';
        //         div.innerText = url;
        //         body.append(div);
        //     })
        // }
        await context.evaluate(() => {
            const sizes1 = document.querySelectorAll('span[class*="size-type"]');
            let ean1 = []
            if (sizes1.length) {
                sizes1.forEach((element) => {
                    element.click();
                    let prevEan = document.querySelector('h2[class*="ean"]') && document.querySelector('h2[class*="ean"]').innerText;
                    ean1.push(prevEan);
                })
            } else {
                let prevEan = document.querySelector('h2[class*="ean"]') && document.querySelector('h2[class*="ean"]').innerText;
                ean1.push(prevEan);
            }

            let actean = [];
            ean1.forEach((element) => {
                actean.push(element.match(/\d+/g)[0]);
            })
            const urlArray = [];
            actean.forEach((element) => {
                const currentUrl = window.location.href;
                urlArray.push(`${currentUrl}?selectedean=${element}`)
            })
            actean.forEach((element, index) => {
                const appendElement = document.createElement('div');
                appendElement.className = 'eaninfo';
                appendElement.setAttribute('ean', actean[index]);
                appendElement.setAttribute('url', urlArray[index]);
                document.body.append(appendElement)
            })
        });
        return await context.extract(variants, { transform });
    },
};