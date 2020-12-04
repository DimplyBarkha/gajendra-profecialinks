const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'SK',
        store: 'mall',
        transform: transform,
        domain: 'mall.sk',
        zipcode: '',
    },
    implementation: async (inputs, parameters, context, dependencies) => {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.evaluate(async () => {
            let scrollTop = 0;
            while (scrollTop !== 20000) {
                await stall(500);
                scrollTop += 1000;
                window.scroll(0, scrollTop);
                if (scrollTop === 20000) {
                    await stall(5000);
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
    },
};
// async function implementation(
// inputs,
// parameters,
// context,
// dependencies,
// ) {
// const { transform } = parameters;
// const { productDetails } = dependencies;
// await context.evaluate(async function () {

// function addElementToDocument(key, value) {
// const catElement = document.createElement('div');
// catElement.id = key;
// catElement.textContent = value;
// catElement.style.display = 'none';
// document.body.appendChild(catElement);
// }
// const URL = window.location.href;
// try {
// document.getElementById('pd_url').remove();
// } catch (error) {
// }
// addElementToDocument('pd_url', URL);
// });
// return await context.extract(productDetails, { transform });
// }