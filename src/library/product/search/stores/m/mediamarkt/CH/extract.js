
const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const allProducts = document.querySelectorAll('div.product-wrapper');
    allProducts.forEach((product, index) => {
      product.setAttribute('rank', `${index + 1}`);
    });

    const productUrl = document.querySelectorAll('h2 > a');
    const prefix = 'https://www.mediamarkt.ch';

    productUrl.forEach((element) => {
      element.setAttribute('product-url', prefix.concat(element.getAttribute('href')));
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.ch/fr',
    zipcode: "''",
  },
  implementation,
};
