const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const allProducts = document.querySelectorAll('div.product.js-product-row');
    allProducts.forEach((product, index) => {
      try {
        const productJson = JSON.parse(product.getAttribute('data-google-360')).ecommerce.click.products[0];
        console.log(productJson);
        if (productJson.rating.match(/\d(.\d)?/)) {
          product.setAttribute('product-rating', productJson.rating.match(/\d(.\d)?/)[0].replace('.', ','));
        }
        if (productJson.brand) product.setAttribute('product-manufacturer', productJson.brand);
      } catch (e) {
        console.log('Error extracting product json');
      }
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform: transform,
    domain: 'newpharma.be',
    zipcode: "''",
  },
  implementation,
};
