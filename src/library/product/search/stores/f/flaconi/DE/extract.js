const { transform } = require('../../../../shared');  
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
  //  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //       while(!!document.querySelector('body > div.wrapper.off-canvas-wrap > div.inner-wrap.row-collapse > div > div.content > div > div > div.toolbar.row > div > div > div:nth-child(3) > a')){
  //         // @ts-ignore
  //         document.querySelector('body > div.wrapper.off-canvas-wrap > div.inner-wrap.row-collapse > div > div.content > div > div > div.toolbar.row > div > div > div:nth-child(3) > a').click()
  //         await new Promise(r => setTimeout(r, 6000));
  //       }
  //     })
  //     await context.extract(productDetails, { transform: transformParam });
  //   }
};
