const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const products = document.querySelectorAll('div[class="col-lg-4 col-md-4 col-sm-4 col-xs-6 item card-col"]');
    products.forEach((product, index) => {
      // set rank
      product.setAttribute('rank', (index + 1).toString());
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'piperitas',
    transform: transform,
    domain: 'piperitas.com',
    zipcode: '',
  }, implementation,
};
