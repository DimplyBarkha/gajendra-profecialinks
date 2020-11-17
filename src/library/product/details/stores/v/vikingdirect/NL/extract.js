const { transform } = require('../../../../shared');


async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const products = document.querySelectorAll('span[class="product__brand-name"]')
    const prefix = 'https://www.vikingdirect.nl';
    // const shortPrefix = 'https:';
    products.forEach((product, index) => {
      // set product url
      const brandLink = product.querySelector('a').getAttribute('href');
      product.setAttribute('brandLink', prefix + brandLink);
      console.log(brandLink);
      console.log(product.setAttribute('brandLink', prefix + brandLink));
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    transform: transform,
    domain: 'vikingdirect.nl',
    zipcode: '',
  },
  implementation,
};