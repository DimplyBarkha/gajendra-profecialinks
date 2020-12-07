const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'GR',
        store: 'hondoscenter',
        transform: transform,
        domain: 'hondoscenter.com',
        zipcode: '',
    },
    implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
        await context.evaluate(async function () {
            function addElementToDocument(key, value) {
                const catElement = document.createElement('div');
                catElement.id = key;
                catElement.textContent = value;
                catElement.style.display = 'none';
                document.body.appendChild(catElement);
                }
            var cookies;
            cookies = document.querySelector('div[class="button-container"] a[class="accept-btn js-accept"]')
            if (cookies != undefined) {
                // @ts-ignore
                document.querySelector('div[class="button-container"] a[class="accept-btn js-accept"]').click()
                await new Promise(r => setTimeout(r, 6000));
            }
        });
        await context.extract(productDetails);
    },
};
