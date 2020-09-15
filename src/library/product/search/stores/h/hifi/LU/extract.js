
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    transform,
    domain: 'hifi.lu',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('section[class~="footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('section[class~="footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('section[class~="products-overview"] > div[class~="row"] > div:last-child img[class~="product-image"]');
    } catch (error) {
      console.log('All products not loaded after scrolling!!');
    }
    return await context.extract(productDetails, { transform });
  },
};
