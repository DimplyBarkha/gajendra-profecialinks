/**
 *
 * @param {{
  *  keywords: string,
  *  page: number,
  *  offset: number,
  * }} inputs
  * @param {{
  *  nextLinkSelector: string,
  *  mutationSelector: string,
  *  loadedSelector: string,
  *  noResultsXPath: string,
  *  spinnerSelector: string,
  *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number }
  * }} parameters
  * @param { ImportIO.IContext } context
  * @param { Record<string, any> } dependencies
  */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { nextLinkSelector, loadedSelector, noResultsXPath } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  const success = await async function () {
    if (nextLinkSelector) {
      console.log('Clicking', nextLinkSelector);
      await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 40000 });
      if (loadedSelector) {
        await context.waitForSelector(loadedSelector, { timeout: 20000 });
      }
      return true;
    }
    return false;
  };

  if (success) {
    return true;
  }

  const url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    nextLinkSelector: 'div[id="toolbar-btm"] a[class*="icn-next-page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="category-grid"]',
    noResultsXPath: '//div[contains(@class, "no-result-box")]',
    openSearchDefinition: null,
    domain: 'domayne.com.au',
    zipcode: '',
  },
  implementation,
};
