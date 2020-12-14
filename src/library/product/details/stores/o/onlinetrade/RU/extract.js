const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    transform: transform,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transform }, context, { productDetails }) => {

    await context.evaluate(async function () {
      try {

        if (document.querySelector('div[class*="goods__items minilisting searchlisting js__goods__items"] div:first-child')) {
          document.querySelector('div[class*="goods__items minilisting searchlisting js__goods__items"] div:first-child a').click();
        }
      } catch (err) {
        console.log(err)
      }
    });

    try {
      await context.waitForSelector('.productPage', { timeout: 30000 });
    } catch (err) {
      console.log(err)
    }
    return await context.extract(productDetails, { transform: transform });
  },
};
