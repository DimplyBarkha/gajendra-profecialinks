
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
async function pagerOne (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const {
    nextLinkSelector,
    loadedSelector,
    loadedXpath,
  } = inputs;

  const ifThereClickOnIt = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 5000 });
    } catch (error) {
      console.log(`The following selector was not found: ${selector}`);
      return false;
    }
    const hasItem = await context.evaluate((selector) => {
      return document.querySelector(selector) !== null;
    }, selector);
    if (hasItem) {
      // try both click
      try {
        await context.click(selector, { timeout: 2000 });
      } catch (error) {
        // context click did not work and that is ok
      }
      await context.evaluate((selector) => {
        const elem = document.querySelector(selector);
        if (elem) elem.click();
      }, selector);
      return true;
    }
    return false;
  };

  if (nextLinkSelector) {
    try {
      await context.waitForSelector('div[id*=sp_message_container]');
      await context.evaluate(async () => {
        const elem = document.querySelector('div[id*=sp_message_container]');
        if (elem.getAttribute('style').includes('block')) {
          elem && elem.setAttribute('style', '');
        }
      });
    } catch (error) {
      console.log('failed to close iframe popup inside pager.js file');
    }
    console.log('Clicking', nextLinkSelector);
    await ifThereClickOnIt(nextLinkSelector);
    await context.waitForNavigation({ timeout: 20000, waitUntil: 'load' });
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
  pagerOne,
};
