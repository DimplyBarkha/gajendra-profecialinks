
/**
 *
 * @param {{
  *  nextLinkSelector: string,
  *  mutationSelector: string,
  *  loadedSelector: string,
  *  loadedXpath: string,
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
    loadedXpath,
    spinnerSelector,
  } = inputs;

  if (spinnerSelector) {
    // this may replace the section with a loader
    await context.click(nextLinkSelector);
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
<<<<<<< HEAD
    }, { timeout: 200000 }, spinnerSelector);
=======
    }, { timeout: 800000 }, spinnerSelector);
>>>>>>> 2970b44c30b7069ddc90cbaec9b22d70491e6a10
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
<<<<<<< HEAD
      context.waitForMutuation(mutationSelector, { timeout: 100000 }),
=======
      context.waitForMutuation(mutationSelector, { timeout: 800000 }),
>>>>>>> 2970b44c30b7069ddc90cbaec9b22d70491e6a10
    ]);
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
<<<<<<< HEAD
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 100000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 100000 });
=======
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 800000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 800000 });
    }
    if (loadedXpath) {
      await context.waitForXPath(loadedXpath, { timeout: 20000 });
>>>>>>> 2970b44c30b7069ddc90cbaec9b22d70491e6a10
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
