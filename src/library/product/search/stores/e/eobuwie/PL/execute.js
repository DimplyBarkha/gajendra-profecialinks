/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    document.querySelector('button[data-testid="permission-popup-accept"]') && document.querySelector('button[data-testid="permission-popup-accept"]').click();
  });

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
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    domain: 'eobuwie.com.pl',
    url: 'https://www.eobuwie.com.pl/s.html?q={searchTerms}',
    loadedSelector: 'ul.products-list',
    noResultsXPath: '//p[@class="note-msg" and contains(text(),"Brak produktów odpowiadających zapytaniu")]',
    zipcode: "''",
  },
  implementation
};
