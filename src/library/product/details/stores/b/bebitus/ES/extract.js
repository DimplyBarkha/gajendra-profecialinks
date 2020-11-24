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
        });
        return await context.extract(productDetails, { transform });
    },
};