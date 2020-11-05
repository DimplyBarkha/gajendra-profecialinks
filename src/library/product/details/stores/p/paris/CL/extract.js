
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
  await context.click('a[class*="read-me"]');
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
    const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
    let scriptTagJSON = '';
    try {
      scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
    } catch (e) {
      console.log('Error in converting text to JSON....');
      scriptTagJSON = '';
    }
    const gtin = scriptTagJSON ? scriptTagJSON.gtin13 : '';
    console.log('gtin', gtin);
    addHiddenDiv('added_gtinText', gtin);
    let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers[0].availability ? scriptTagJSON.offers[0].availability : '' : '' : '';
    availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
    addHiddenDiv('added_availabilityText', availabilityText);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    transform,
    domain: 'paris.cl',
    zipcode: '',
  },
  implementation,
};
