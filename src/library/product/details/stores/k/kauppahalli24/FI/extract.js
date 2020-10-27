
const { cleanUp } = require('../../../../shared');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { id } = inputs;
  const pageLoaded = await context.evaluate(async () => Boolean(document.querySelector('div[class*="frosmo-card-content"]')));
  if (!pageLoaded) {
    const response = await context.evaluate(async (id) => {
      return await fetch(`https://kauppahalli24_fi_api.frosmo.com/?queries=%5B%22${id}%22%5D&method=getProductsBySku`).then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error:', error));
    }, id);
    if (response && response.data[0] && response.data[0].products[0] && response.data[0].products[0].id) {
      const productId = response.data[0].products[0].id;
      await context.goto(`https://www.kauppahalli24.fi/tuotteet/?id=${productId}#/pid/${productId}`, { timeout: '40000', waitUntil: 'load', checkBlocked: true });
    }
  }
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const sku = document.evaluate('//div[contains(@class,"frosmo-popup__body frosmo-store__card")]//@data-sku', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (sku && sku.nodeValue) {
      const response = await fetch(`https://kauppahalli24_fi_api.frosmo.com/?queries=%5B%22${sku.nodeValue}%22%5D&method=getProductsBySku`).then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error:', error));
      if (response && response.data[0] && response.data[0].products[0] && response.data[0].products[0].id) {
        const dataObj = response.data[0].products[0];
        addElementToDocument('pd_price', String(dataObj.price).replace('.', ','));
        Number(dataObj.inStock) && addElementToDocument('pd_stock', 'Yes');
        dataObj && dataObj.ingredients && addElementToDocument('pd_ingredients', dataObj.ingredients);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'kauppahalli24',
    transform: cleanUp,
    domain: 'kauppahalli24.fi',
    zipcode: '',
  },
  implementation,
};
