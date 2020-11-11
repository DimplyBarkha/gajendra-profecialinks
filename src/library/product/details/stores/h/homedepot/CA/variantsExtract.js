const { transform } = require('./variantFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { variants }) => {
    try {
      await context.click('localization-confirmation div:nth-child(1)>button');
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      console.log('no localized button found');
    }
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    try {
      await context.waitForSelector('.hdca-product__description');
    } catch (error) {
      console.log('product description is not loaded');
    }
    await new Promise(resolve => setTimeout(resolve, 50000));
    return await context.extract(variants, { transform });
  },
};
