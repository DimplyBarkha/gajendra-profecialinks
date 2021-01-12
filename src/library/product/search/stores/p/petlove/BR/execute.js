module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    domain: 'petlove.com.br',
    url: 'https://www.petlove.com.br/busca?q={searchTerms}',
    loadedSelector: 'div#shelf-loop > div.catalog-list-item',
    noResultsXPath: '//div[@class="empty-page"]',
    zipcode: '',
  },
  implementation: async ({ zipcode, keywords }, { url, loadedSelector, noResultsXPath }, context, dependencies) => {
    if (!keywords) throw new Error('Missing keywords input value');
    if (!loadedSelector) throw new Error('Missing loadedSelector parameter');
    if (!noResultsXPath) throw new Error('Missing noResultsXPath parameter');

    url = url.replace('{searchTerms}', encodeURIComponent(keywords));
    await dependencies.goto({ url, zipcode: zipcode });

    await context.waitForFunction(
      (selector, xpath) => {
        return !!document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
