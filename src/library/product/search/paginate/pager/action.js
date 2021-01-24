
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
  const {noResultsXPath} = inputs;

  console.log('noResultsXPath', noResultsXPath);

  if (spinnerSelector) {
    // this may replace the section with a loader
    await context.click(nextLinkSelector);
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 20000 }, spinnerSelector);
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 20000 }),
    ]);
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 20000 });
    if(noResultsXPath) {
      try {
        await context.waitForXPath(noResultsXPath);
        console.log('found a xpath showing that the page has no results');
      } catch(err) {
        console.log('got into some error while waiting for noresults xpaths', err.message);
      }
      let pageHasResults = await context.evaluate(async (noResultsXPath) => {
        console.log('checking for no results -- ' + noResultsXPath);
        let elm =  document.evaluate(noResultsXPath, document, null, 7, null);
        if(elm && elm.snapshotLength > 0 && elm.snapshotItem(0)) {
          return false;
        }
        return true;
      }, noResultsXPath);
      console.log('pageHasResults', pageHasResults);
      if(!pageHasResults) {
        return pageHasResults;
      }
    }
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 30000 });
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
