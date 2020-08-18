const { transform } = require('../format');

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

  // Fetching brand from JSON and if not available then first word from the product name
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.evaluate('//div[@id="presentation"]//div[@itemprop="description"]//img/@src | //div[@id="presentation"]//div[@itemprop="description"]//video/@src', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const descriptionSelector = document.querySelector('div[id="presentation"] div[itemprop="description"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    }
    else {
      addHiddenDiv('added-description', description);
    }
  });

  await new Promise(resolve => setTimeout(resolve, 20000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform,
    domain: 'boulanger.com',
    zipcode: '',
  },
  implementation,
};
