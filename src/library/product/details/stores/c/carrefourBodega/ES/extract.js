/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
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
    let node = document.evaluate("//script[contains(.,'dataLayer = ')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // @ts-ignore
    node = node && node.textContent.replace(/\r\n|\n|\r/gm, '').match(/.*"productEAN":\["(\d+).*/gm).length > 0 ? node.textContent.replace(/\r\n|\n|\r/gm, '').replace(/.*"productEAN":\["(\d+).*/gm, '$1') : '';
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
