
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
    //await context.setDefaultTimeout(60000);
    let spinnerIsPresent = true;
    try {
      let maxTime = 180000;
      let thisTime = 0;
      while(spinnerIsPresent && thisTime < maxTime) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        thisTime += 5000;
        spinnerIsPresent = await context.evaluate(async (spinnerSelector) => {
          let elm = document.querySelector(spinnerSelector);
          if(elm) {
            console.log('spinner selector is still present', spinnerSelector);
            return true;
          }
          return false;
        },
        spinnerSelector);
      }
      if(spinnerIsPresent) {
        console.log('we have waited till ' + thisTime + ' ms');
      }
    } catch(err) {
      console.log('we have some error', err.message);
    }
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 30000 }, spinnerSelector);
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
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 20000 });
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
