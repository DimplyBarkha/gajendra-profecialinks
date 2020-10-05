const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(() => {
    const productSelectors = document.querySelectorAll('div._3O0U0u>div');
    for (let i = 0; i < productSelectors.length; i++) {
      productSelectors[i].setAttribute('rankOrganic', `${i + 1}`);
      urlData = document.querySelectorAll('a._31qSD5')[i] ? document.querySelectorAll('a._31qSD5')[i].href : document.querySelectorAll('a.Zhf2z-')[i].href
      document.querySelectorAll('div._3O0U0u>div')[i].setAttribute('producturl', `${urlData}`)
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
