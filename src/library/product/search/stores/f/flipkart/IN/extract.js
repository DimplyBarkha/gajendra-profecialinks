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
    const productSelectors = document.querySelectorAll('div._1UoZlX');
    for (let i = 0; i < productSelectors.length; i++) {
      productSelectors[i].setAttribute('rankOrganic', `${i + 1}`);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
