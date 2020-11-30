const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const searchUrl = window.location.href;
    const productList = document.querySelectorAll('ul.products-grid > li');
    productList.forEach(element => {
      element.querySelector('h2.product-name').setAttribute('searchurl', searchUrl);
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'did',
    transform,
    domain: 'did.ie',
    zipcode: '',
  },
  implementation,
};
