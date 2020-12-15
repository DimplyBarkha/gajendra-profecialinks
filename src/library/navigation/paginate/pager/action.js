
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
    }, { timeout: 20000 }, spinnerSelector);
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    // await Promise.all([
    //   context.click(nextLinkSelector),
    //   // possible race condition if the data returned too fast, but unlikely
    //   context.waitForMutuation(mutationSelector, { timeout: 20000 }),
    // ]);
    await context.evaluate(async () => {
      const temp_nextLinkSelector = document.querySelector('button[data-testid="reviews-block-page-next"]:enabled');
      if (temp_nextLinkSelector) {
        temp_nextLinkSelector.click();
      }
      var observer = new MutationObserver(function (mutations) {
        if (document.querySelector('div.sc-1xuymxc-0.ExfKH')) {
          observer.disconnect();
        }
      });
      observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
    });
    return true;
  }

  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
    // await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 20000 })
    // await context.click(nextLinkSelector, { timeout: 20000 })
    await context.evaluate(async (nextLinkSelector) => {
      document.querySelector(nextLinkSelector).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, nextLinkSelector).then(async () => {
      await new Promise(res => setTimeout(res, 3000));
      await context.click(nextLinkSelector, { timeout: 20000 });
    });
    if (loadedSelector) {
      await context.waitForSelector(loadedSelector, { timeout: 20000 });
    }
    if (loadedXpath) {
      await context.waitForXPath(loadedXpath, { timeout: 20000 });
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
