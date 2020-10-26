const {cleanUp } = require('../../../../shared');

/**
 *
 * @param {{
  *  nextLinkSelector: string,
  *  mutationSelector: string,
  *  loadedSelector: string,
  *  spinnerSelector: string,
  * }} inputs
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
  const {
    nextLinkSelector,
    mutationSelector,
    loadedSelector,
    spinnerSelector,
  } = inputs;

  if (spinnerSelector) {
    // this may replace the section with a loader
    await context.click(nextLinkSelector);
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 120000 }, spinnerSelector);
    console.log('Spinner Loaded', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 120000 }),
    ]);
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 120000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 120000 });
    }
    return true;
  }
  return false;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'vons',
    transform: cleanUp,
    domain: 'vons.com',
    zipcode: '',
  },
};
