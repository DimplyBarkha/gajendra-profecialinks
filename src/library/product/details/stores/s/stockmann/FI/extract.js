const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
     const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 500;
        window.scroll(0, scrollTop);
        await stall(1500);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    try {
      await context.waitForSelector('class="product-slider"', { timeout: 200000 });
  } catch (error) {
      console.log("Manufacturer Description did not loaded....");
  }
  };
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
  
};
