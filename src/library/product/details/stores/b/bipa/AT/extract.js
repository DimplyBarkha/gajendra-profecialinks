const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    transform,
    domain: 'bipa.at',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(() => {
      const zoom = document.querySelector('.magnifyframe');

      if (zoom) {
        zoom.setAttribute('zoom', 'yes');
      }
    });
    await context.extract(productDetails, { transform });
  },
};
