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

  await new Promise((resolve) => setTimeout(resolve, 20000));
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
