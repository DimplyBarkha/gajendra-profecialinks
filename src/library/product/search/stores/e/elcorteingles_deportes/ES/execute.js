
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/search/1/?s={searchTerms}',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"]',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    console.log(`URL =============> ${url}`);
    await dependencies.goto({ url, zipcode: inputs.zipcode });

    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 30000 }, parameters.loadedSelector, parameters.noResultsXPath);
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
