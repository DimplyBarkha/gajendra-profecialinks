const { cleanUp } = require('./transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'bebitus',
        transform: cleanUp,
        domain: 'bebitus.com',
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
            const element = document.querySelector('div[class="main-content"]>script[type="text/javascript"]');
            // @ts-ignore
            const newele = element.innerText.trim();
            const iterate = newele.split(' ');
            let rpc = '';
            iterate.forEach((element, index) => {
                if (element == "groupEan") {
                    rpc = iterate[index + 2];
                    var appendElement = document.querySelector('img[class="windeln-zoom-image"]');
                    appendElement.setAttribute('RPC', rpc);
                }
            })
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
            actean.forEach((element, index) => {
                const appendElement = document.createElement('div');
                appendElement.className = 'eaninfo';
                appendElement.setAttribute('ean', actean[index]);
                document.body.append(appendElement)
            })
        });
        return await context.extract(productDetails, { transform });
    },
};