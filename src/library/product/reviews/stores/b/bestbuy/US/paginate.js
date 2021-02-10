/* eslint-disable space-before-function-paren */

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
async function implementation(
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
  if (nextLinkSelector) {
    console.log('Clicking', nextLinkSelector);
    await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 20000 });
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
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'bestbuy',
    nextLinkSelector: 'div.page-pagination > div > div > div:nth-child(2) > ul > li.page.next > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null, // 'div.pl-page-content',
    noResultsXPath: '//h3[@class="no-results-message"]',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};
