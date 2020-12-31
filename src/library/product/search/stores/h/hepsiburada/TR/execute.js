module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    domain: 'hepsiburada.com',
    url: 'https://www.hepsiburada.com/ara?q={searchTerms}',
    loadedSelector: 'ul.product-list.results-container.do-flex.list',
    noResultsXPath: '//ul[contains(@class,"no-results")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    console.log('params', parameters);

    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    await context.evaluate(() => { document.cookie = 'hb_adult=1'; });
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
