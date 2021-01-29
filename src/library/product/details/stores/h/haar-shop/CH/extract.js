const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    transform,
    domain: 'haar-shop.ch',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    try {
      await context.waitForSelector('div[id="inpage_container"] div[class="inpage_selector_InTheBox"] span', { timeout: 30000 });
      console.log('selector of inTheBox exist');
    } catch (e) {
      console.log("selector of inTheBox doesn't exist");
    }
    return await context.extract(productDetails, { transform });
  
  },
};
