
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

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function loadResults () {
      const loadMoreButtonSelector = document.querySelector('a[class*="read-me"]');
      if (loadMoreButtonSelector) {
        loadMoreButtonSelector.click();
      }
    }
    function fetchDetailsFromScript () {
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
      addHiddenDiv('added_gtinText', gtin);
      let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers[0].availability ? scriptTagJSON.offers[0].availability : '' : '' : '';
      availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
      addHiddenDiv('added_availabilityText', availabilityText);
    }
    fetchDetailsFromScript();
    loadResults();
    // If images are present in description then add to manufacturerDescription else add to description
    const descriptionSelector = document.evaluate('//div[contains(@class, "description-table")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    const manufacturerImageFlag = document.querySelector('div[class="description-table"] img');
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
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
