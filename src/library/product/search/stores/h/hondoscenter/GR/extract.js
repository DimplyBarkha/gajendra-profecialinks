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
    implementation: async (
        inputs,
        parameters,
        context,
        dependencies,
    ) => {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        const applyScroll = async function (context) {

            await context.evaluate(async function () {
                while (!!document.querySelector('div.scrolllist-pager-notification > div.button-container > span')) {
                    let scrollTop = 0;
                    while (scrollTop !== 20000) {
                        scrollTop += 1000;
                        window.scroll(0, scrollTop);
                        await stall(1000);
                    }
                    function stall(ms) {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, ms);
                        });
                    }
                    document.querySelector('div.scrolllist-pager-notification > div.button-container > span').click()
                    await new Promise(r => setTimeout(r, 6000));
                }

                let scrollTop = 0;
                while (scrollTop !== 20000) {
                    scrollTop += 1000;
                    window.scroll(0, scrollTop);
                    await stall(1000);
                }
                function stall(ms) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, ms);
                    });
                }

            });
        };
        await applyScroll(context);
        return await context.extract(productDetails, { transform });
    }
};
    // const { transform } = require('../../../../shared');
// async function implementation (
// inputs,
// parameters,
// context,
// dependencies,
// ) {
// const { transform } = parameters;
// const { productDetails } = dependencies;
// await context.evaluate(async () => {
// while(!!document.querySelector('body > div.site-container.search_products-template > div.search-region.search-products-page.bottom-space.elastic > div > div > div > section > div.scrolllist-pager-notification > div.button-container > span')){
// document.querySelector('body > div.site-container.search_products-template > div.search-region.search-products-page.bottom-space.elastic > div > div > div > section > div.scrolllist-pager-notification > div.button-container > span').click()
// await new Promise(r => setTimeout(r, 6000));
// }
// })
// return await context.extract(productDetails, { transform });
// }
// module.exports = {
// implements: 'product/search/extract',
// parameterValues: {
// country: 'GR',
// store: 'hondoscenter',
// transform: transform,
// domain: 'hondoscenter.com',
// },
// implementation,
// };