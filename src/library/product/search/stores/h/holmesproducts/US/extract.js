const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  const cssAllProduct = '.product-tile';

  await context.evaluate(async (cssAllProduct) => {
    function addHiddenDiv (id, content, parent) {
      console.log(`inputs: ${JSON.stringify({
        id: id,
        content: content,
        parent: parent
      })}`);

      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      parent.appendChild(newDiv);
    }

    const allProducts = document.querySelectorAll(cssAllProduct);
    if(!allProducts.length) {
      console.log('No products are found');
      console.log(`cssAllProduct: ${cssAllProduct}`);
      return false;
    }
    
    allProducts.forEach(product => {
      const productJson = product && product.dataset && product.dataset.analyticsData && JSON.parse(product.dataset.analyticsData);

      // product is the parent div found from querySelectorAll
      // We are setting the attribute inside there respective parents
      const brand = productJson.brand;
      brand? addHiddenDiv('brand', brand, product) : console.log('Brand detail not found');

      const category = productJson.category;
      category? addHiddenDiv('category', category, product) : console.log('category detail not found');

      const id = productJson.id;
      id? addHiddenDiv('id', id, product) : console.log('id detail not found');

      const name = productJson.name;
      name? addHiddenDiv('name', name, product) : console.log('name detail not found');

      const sku = productJson.product_sku;
      sku? addHiddenDiv('sku', sku, product) : console.log('sku detail not found');
    })
  }, cssAllProduct);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    transform,
    domain: 'holmesproducts.com',
    zipcode: '',
  },
  implementation
};
