
/**
 *
 * @param { {[k:string]: string} } inputs
 * @param { {[k:string]: any} } parameters
 * @param { ImportIO.IContext } context
 * @param { {[k:string]: any} } dependencies
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

  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
  if (!hasNextLink) {
    return false;
  }

  if (spinnerSelector) {
    // this may replace the section with a loader
    await context.click(nextLinkSelector);
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 30000 }, spinnerSelector);
  } else if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 10000 }),
    ]);
  } else {
    await Promise.all([
      context.waitForNavigation({ timeout: 10000, waitUntil: 'load' }),
      context.click(nextLinkSelector),
    ]);
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 10000 });
    }
  }
  return true;
}

module.exports = {
  parameters: [],
  inputs: [],
  dependencies: {
  },
  implementation,
};
