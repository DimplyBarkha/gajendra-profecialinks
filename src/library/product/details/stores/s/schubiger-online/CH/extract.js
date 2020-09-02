
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Fetching brand from window object
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const brand = window.utag_data ? window.utag_data ? window.utag_data.product_attributes_brand ? window.utag_data.product_attributes_brand.length ? window.utag_data.product_attributes_brand[0] : '' : '' : '' : '';
    console.log('brand -----------> ', brand);
    addHiddenDiv('added_brandText', brand);
  });

  // Clicking on the product specifications and other tabs to load more product details on the DOM
  await context.evaluate(async function () {
    const infoTabSelector = document.querySelectorAll('div[class*="accordion__item"] div[class*="accordion__item-head"]');
    for (let i = 0; i < infoTabSelector.length; i++) {
      const infoTab = infoTabSelector[i];
      infoTab && infoTab.click();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    transform,
    domain: 'schubiger-online.ch',
    zipcode: '',
  },
  implementation,
};
