const { transform } = require('./format');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('a[class*="collapse in collapsed"]');
  } catch (e) {
    console.log('Error in click ingredient List');
  }
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const scriptTagSelector = document.querySelector('script[type="text/javascript"]');
    // @ts-ignore
    const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
    let scriptTagJSON = '';
    try {
      scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
    } catch (e) {
      console.log('Error in converting text to JSON....');
      scriptTagJSON = '';
    }
    // @ts-ignore
    const gtin = scriptTagJSON ? scriptTagJSON.gtin13 : '';
    console.log('gtin', gtin);
    addHiddenDiv('added_gtinText', gtin);
    // @ts-ignore
    let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers[0].availability ? scriptTagJSON.offers[0].availability : '' : '' : '';
    availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
    addHiddenDiv('added_availabilityText', availabilityText);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: "''",
  },
  implementation,
};
