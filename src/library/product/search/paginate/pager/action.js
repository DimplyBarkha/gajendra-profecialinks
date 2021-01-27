
/**
 *
 * @param {{
 *  nextLinkXpath: string,
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
    nextLinkXpath,
    mutationSelector,
    loadedSelector,
    spinnerSelector,
  } = inputs;

  if (spinnerSelector) {
    // this may replace the section with a loader
    await context.click(nextLinkXpath);
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 200000 }, spinnerSelector);
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkXpath),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 20000 }),
    ]);
    return true;
  }

  if (nextLinkXpath) {
    console.log('Clicking', nextLinkXpath);
    await context.clickAndWaitForNavigation(nextLinkXpath, {}, { timeout: 200000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 200000 });
    }
    return true;
  }
  return false;
}

module.exports = {
  parameters: [],
  inputs: [],
  dependencies: {
  },
  implementation,
};