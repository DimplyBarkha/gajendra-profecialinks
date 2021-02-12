
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    domain: 'medimax.de',
    url: 'https://www.medimax.de/search/?text={searchTerms}',
    loadedSelector: 'div[data-et-name]',
    noResultsXPath: '//h1[@class="search-no-hits-headline"]',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await new Promise(resolve => setTimeout(resolve, 4000));
    try {
      await context.click('button.cookies-overlay-dialog__accept-all-btn');
    } catch (err) {
      console.log(err);
    }

    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
      try {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
      } catch(err) {
        console.log('we got some error while waiting', err.message);
      }
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  }
};
