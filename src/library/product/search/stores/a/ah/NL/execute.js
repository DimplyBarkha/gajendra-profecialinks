
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    domain: 'ah.nl',
    url: 'https://www.ah.nl/zoeken?query={searchTerms}&page=4',
    loadedSelector: 'article[data-testhook="product-card"] img',
    noResultsXPath: '//div[@data-testhook="search-no-results"]',
    zipcode: '',
  },
  implementation: async function implementation (
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
    console.log('Checking no results', parameters.noResultsXPath);
    try {
      await context.waitForSelector('.f-load-more button');
      await context.evaluate(() => {
        document.querySelector('.f-load-more').scrollIntoView({ behavior: 'smooth' });
      });
      await context.click('.f-load-more button');
    } catch (err) {
      console.log('No new page to load');
    }
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
