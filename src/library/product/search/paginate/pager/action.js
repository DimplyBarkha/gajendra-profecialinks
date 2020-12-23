
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
<<<<<<< HEAD
    }, { timeout: 80000 }, spinnerSelector);
=======
    }, { timeout: 90000 }, spinnerSelector);
>>>>>>> 519838df2d8fdcfd158d1671398e7e15ba2a54dc
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
<<<<<<< HEAD
      context.waitForMutuation(mutationSelector, { timeout: 80000 }),
=======
      context.waitForMutuation(mutationSelector, { timeout: 90000 }),
>>>>>>> 519838df2d8fdcfd158d1671398e7e15ba2a54dc
    ]);
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
<<<<<<< HEAD
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 80000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 80000 });
=======
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 90000 });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 90000});
>>>>>>> 519838df2d8fdcfd158d1671398e7e15ba2a54dc
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
