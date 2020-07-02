/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let node = (document.querySelector("div[class='pdp'] button").getAttribute('data-datalayer')) ? document.querySelector("div[class='pdp'] button").getAttribute('data-datalayer') : '';
    node = (node && JSON.parse(node)) ? JSON.parse(node) : '';
    // @ts-ignore
    node = (node && node.ecommerce && node.ecommerce.add && node.ecommerce.add.products && node.ecommerce.add.products[0].id && JSON.parse(node.ecommerce.add.products[0].id)[0]) ? JSON.parse(node.ecommerce.add.products[0].id)[0] : '';
    if (node) {
      addHiddenDiv('ii_gtin', node);
    }
  });
  return await context.extract(productDetails, { transform });
}

const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation,
};
