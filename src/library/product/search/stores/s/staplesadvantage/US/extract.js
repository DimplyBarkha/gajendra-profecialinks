const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const searchUrl = window.location.href;
    const products = document.querySelectorAll('div[class="productView__productTileRows"] div[class="nested_grid_content"]');
    products.forEach(product => {
      product.setAttribute('searchurl', searchUrl);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: transform,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
  implementation,
};
