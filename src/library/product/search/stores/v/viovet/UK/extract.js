const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const products = document.querySelectorAll('li[itemtype="http://schema.org/Product"]');
    const prefix = 'https://www.viovet.co.uk';
    const shortPrefix = 'https:';
    products.forEach((product, index) => {
      // set product url
      const productUrl = product.querySelector('a').getAttribute('href');
      product.setAttribute('product_url', prefix + productUrl);
      // set rank
      product.setAttribute('rank', (index + 1).toString());
      // set img url
      const imageUrl = product.querySelector('a img').getAttribute('src');
      product.setAttribute('image_url', shortPrefix + imageUrl);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    transform: transform,
    domain: 'viovet.co.uk',
    zipcode: '',
  },
  implementation,
};
