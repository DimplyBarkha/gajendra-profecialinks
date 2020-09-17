const { transform } = require('./transfer');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('product-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    let i = 0;
    document.querySelectorAll('product-tile').forEach(node => {
      var productTileObject = node.attributes[1].value.trim();
       var productData =JSON.parse(productTileObject);
        addHiddenDiv(node,productData.ecommerce.click.products[0].id,productData.ecommerce.click.products[0].id)
      i++;
    });
  });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    transform: transform,
    domain: 'magasin.dk',
    zipcode: '',
  },  
  implementation,
};
