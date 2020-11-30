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
    // implementation: async (
    //     inputs,
    //     parameters,
    //     context,
    //     dependencies,
    // ) => {
    //     const { transform } = parameters;
    //     const { productDetails } = dependencies;
    //     await context.waitForFunction(async function () {
    //         while (!!document.querySelector('div[class="button-container"]>span')) {
    //             // @ts-ignore
    //             document.querySelector('div[class="button-container"]>span').click()
    //             await new Promise(r => setTimeout(r, 6000));
    //         }
    //         var elem, scrollTotalHeight;
    //         await scroll();
    //         async function scroll() {
    //             let scrollTop = 0;
    //             while (scrollTop !== 20000) {
    //                 await stall(500);
    //                 scrollTop += 1000;
    //                 window.scroll(0, scrollTop);
    //                 if (scrollTop === 20000) {
    //                     await stall(5000);
    //                     break;
    //                 }
    //             }
    //             function stall(ms) {
    //                 return new Promise((resolve, reject) => {
    //                     setTimeout(() => {
    //                         resolve();
    //                     }, ms);
    //                 });
    //             }
    //         }
    //     }, { timeout: 90000 });
    //     return await context.extract(productDetails, { transform });
    // }
};
