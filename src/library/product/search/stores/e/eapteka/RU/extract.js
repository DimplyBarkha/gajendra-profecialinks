const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const currentUrl = window.location.href;
    const products = document.querySelectorAll('section.cc-item');
    products.forEach(product => {
      product.setAttribute('searchurl', currentUrl);
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    transform: transform,
    domain: 'eapteka.ru',
    zipcode: '',
  },
  implementation,
};
