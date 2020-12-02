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
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('product-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }

    document.querySelectorAll('product-tile').forEach(node => {
      const attr = node.getAttribute('data-gtm-event');
      if (attr) {
        var productTileObject = attr.trim();
        var productData = JSON.parse(productTileObject);
        if (productData && productData.ecommerce && productData.ecommerce.click && productData.ecommerce.click.products[0]) {
          addHiddenDiv(node, productData.ecommerce.click.products[0].id, productData.ecommerce.click.products[0].id);
        }
      }
    });
    if (document.querySelector('div.show-more > div.load-more > button[class="button -border"]')) {
      document.querySelector('div.show-more > div.load-more > button[class="button -border"]').click();
      await stall(3000);
    }
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
