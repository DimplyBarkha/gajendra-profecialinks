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
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    console.log(`noResultsXPath: ${parameters.noResultsXPath}`);
    return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), parameters.noResultsXPath);
  },
};
