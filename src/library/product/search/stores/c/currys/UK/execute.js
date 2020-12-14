
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    url: 'https://www.currys.co.uk/gbuk/search-keywords/xx_xx_xx_xx_xx/{searchTerms}/xx-criteria.html',
    loadedSelector: 'div[data-component="product-list-view"] div.productListImage',
    noResultsXPath: '//section[contains(@class,"sfc")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    try {
      console.log('Wait for cookies popup');
      await context.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 });
      console.log('Accept cookies');
      await context.click('#onetrust-accept-btn-handler');
    } catch (e) {
      console.log('No cookies popup');
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
