const { transform } = require('../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
  },
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  //   // await context.waitForSelector('div>img[name="product-module-image"]', { timeout:20000 })
  //   const applyScroll = async function (context) {
  //     await context.evaluate(async function () {
  //       let scrollTop = 0;
  //       while (scrollTop !== 20000) {
  //         scrollTop += 1000;
  //         window.scroll(0, scrollTop);
  //         await stall(1000);
  //       }
  //       function stall(ms) {
  //         return new Promise((resolve, reject) => {
  //           setTimeout(() => {
  //             resolve();
  //           }, ms);
  //         });
  //       }
  //     });
  //   };
  //   // await applyScroll(context);
  //   async function addProductCode() {
  //     async function getProductCodeFromUrl(url) {
  //       const response = await fetch(url);
  //       const html = await response.text();
  //       const code = html.match(/("bySkuId":{")([^"]+)/);
  //       if (!code) return '';
  //       return code[2];
  //     }
  //     const nodes = Array.from(document.querySelectorAll('h3[class*="Dawzg "]>a'));
  //     const urls = nodes.map(elm => elm.href);
  //     const promises = urls.map(url => getProductCodeFromUrl(url));
  //     const productCodes = await Promise.all(promises);
  //     await Promise.all(promises);
  //     for (let index = 0; index < nodes.length; index++) {
  //       nodes[index].setAttribute('product-code', productCodes[index]);
  //     }
  //     console.log(urls);
  //     console.log(productCodes);
  //   }
  //   // await applyScroll(context);
  //   await context.evaluate(addProductCode);
  //   return await context.extract(productDetails, { transform });
  // },
};
