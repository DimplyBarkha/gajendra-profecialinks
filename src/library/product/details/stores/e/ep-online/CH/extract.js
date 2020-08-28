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
  // If cookie pop up appears then clicking on accept button
  await context.evaluate(async function () {
    const cookieButtonSelector = document.querySelector(
      'button[class*="accept-all-btn"]',
    );
    cookieButtonSelector && cookieButtonSelector.click();
  });
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // If images are present in description then add to manufacturerDescription else add to description
    // eslint-disable-next-line prefer-const
    let descriptionSelector = document.evaluate(
      '//*[@id="details-tab"]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description
      ? description.replace(/(\n\s*){1,}/g, ' || ')
      : '';
    const manufacturerImageFlag = document.querySelector(
      'div[id*="details-tab"] iframe');
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
    country: 'CH',
    store: 'ep-online',
    transform,
    domain: 'ep-online.ch',
    zipcode: '',
  },
  implementation,
};
