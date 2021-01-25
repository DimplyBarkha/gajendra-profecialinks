module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-list.results-container.do-flex.list',
    noResultsXPath: '//ul[contains(@class,"no-results")]',
    openSearchDefinition: null,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;
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
    await context.goto(url, {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: true,
      block_ads: false,
    });
    await context.evaluate(() => { document.cookie = 'hb_adult=1'; });
    await context.goto(url, {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: true,
      block_ads: false,
    });
    if (loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }
    if (loadedXpath) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedXpath, noResultsXPath);
    }
    console.log('Checking no results', noResultsXPath);

    if (resultsDivSelector) {
      // counting results
      const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
      console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
      return !!resultNB;
    }

    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const e = r.iterateNext();
      return !e;
    }, noResultsXPath);
  },
};
