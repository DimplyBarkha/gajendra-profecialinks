
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
    const loadMoreButtonSelector = await document.querySelector('a[class*="read-me"]');
    if (loadMoreButtonSelector) {
      await loadMoreButtonSelector.click();
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
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
    function fetchTechnicalInfo () {
      const technicalInfoSelector = document.evaluate('//div[@class="description-table"]//a[contains(@href, ".pdf")]/@href', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const technicalInfoFlag = technicalInfoSelector ? 'Yes' : 'No';
      addHiddenDiv('added_technicalInfo', technicalInfoFlag);
    }
    fetchDetailsFromScript();
    fetchTechnicalInfo();
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
