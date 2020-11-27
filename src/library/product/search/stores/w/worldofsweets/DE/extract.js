const { transform } = require('../format');
 async function implementation (
    inputs,
    { transform: transformParam },
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      const popUps = document.getElementById('uc-btn-accept-banner');
      if (popUps) popUps.click();
    });

    return await context.extract(productDetails, { transform: transformParam });
  }
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    transform: transform,
    domain: 'worldofsweets.de',
    zipcode: '',
  },
  implementation,
};