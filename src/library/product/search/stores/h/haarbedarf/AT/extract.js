const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const productsOnPage = document.querySelectorAll('div.loop-product-image-wrapper');
    const numberOfProductsOnPage = productsOnPage ? productsOnPage.length : 0;
    for (let i = 0; i < numberOfProductsOnPage; i++) {
      document.querySelectorAll('div.loop-product-image-wrapper')[i].setAttribute('rankOrganic', `${i + 1}`);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'haarbedarf',
    transform: transform,
    domain: 'haarbedarf.at',
    zipcode: '',
  },
  implementation,
};
