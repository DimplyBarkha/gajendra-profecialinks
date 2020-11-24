const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    transform: cleanUp,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { cleanUp } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('.slick-list.draggable .slick-active img', { timeout: 30000 });
    } catch (err) {
      console.log('Image did not load');
    }
    // await context.waitForSelector('.fl-picture--img');
    return await context.extract(productDetails, { cleanUp });
  },

};
