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
  try {
  await context.waitForXPath("//div[@class='slick-track']//article",{ timeout:10000 });
  }
  catch(error){
    console.log('loading');
  }
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch brandText from script tag as not available directly on DOM.
    function fetchBrandFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@type="application/ld+json"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const brandRegex = /.*Brand.*?name":"(.*?)".*/gm;
      let brandText = '';
      if (brandRegex.test(scriptTagData)) {
        brandText = scriptTagData ? scriptTagData.replace(brandRegex, '$1') : '';
      }
      brandText = brandText ? brandText.trim() : '';
      addHiddenDiv('added_brandText', brandText);
    }
    fetchBrandFromScript();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    transform,
    domain: 'fnac.pt',
    zipcode: '',
  },
  implementation,
};
