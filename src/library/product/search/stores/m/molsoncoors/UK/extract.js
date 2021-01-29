const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const addElementToDocument = (key, value) => {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    addElementToDocument('added-search-url', window.location.href);
    const allProducts = document.querySelectorAll('div.cc_product_item.cc_grid_item');
    allProducts.forEach((product) => {
      const productUrl = `https://www.mymolsoncoors.com${product.querySelector('div.cc_grid_image_container > a').getAttribute('href')}`;
      product.setAttribute('product-url', productUrl);
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'molsoncoors',
    transform: transform,
    domain: 'mymolsoncoors.com',
    zipcode: "''",
  },
  implementation,
};
