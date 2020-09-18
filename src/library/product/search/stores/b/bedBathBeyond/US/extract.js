const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  function addRatings () {
    Array.from(document.querySelectorAll('[data-locator="product_tile_rating"] > span')).forEach(elm => {
      const denominator = elm.querySelector('svg').getAttribute('width') * 2;
      const numerator = elm.querySelector('svg:last-child').getAttribute('width') * 100;
      const rating = Math.round(numerator / denominator) / 10;
      elm.closest('article').setAttribute('rating', rating.toString());
    });
  }

  await context.evaluate(() => {
    if (!document.querySelector('header[class*="SearchHeader"')) {
      throw new Error('Not a Search Page');
    }
  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(addRatings);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bedBathBeyond',
    transform,
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
  implementation,
};
