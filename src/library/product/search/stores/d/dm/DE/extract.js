const { transform } = require('../../../../shared');

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
      const ratingStars = [...elm.querySelectorAll('img[data-dmid="filled-star"]')].map(rate => Number(rate.getAttribute('alt').match(/\d+/)[0]));
      const rating = ratingStars.reduce((a,b) => a+b, 0)/100;
      elm.setAttribute("rating",rating);
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
