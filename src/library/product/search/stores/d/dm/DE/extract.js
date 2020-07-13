const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('[data-dmid="product-tile-rating"]').forEach(elm => {
      const ratingStars = [...elm.querySelectorAll('img[data-dmid="filled-star"]')].map(rate => Number(rate.getAttribute('alt') ? rate.getAttribute('alt').match(/\d+/)[0] : '0'));
      const rating = ratingStars.reduce((a, b) => a + b, 0) / 100;
      const ratingValue = rating.toString().replace(".", ",");
      elm.setAttribute('rating', ratingValue);
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
  },
  implementation,
};
