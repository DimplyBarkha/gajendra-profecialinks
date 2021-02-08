
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/supermercado/buscar/?term={searchTerms}',
    loadedSelector: 'div.product_tile-prices',
    noResultsXPath: '//p[contains(text(),"No se han encontrado ") or contains(text(),"no se han encontrado ")] | //span[contains(text(),"No hemos encontrado nada buscando") ] | //div[contains(@class,"_padded _extra_mb")]',
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
