
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
  const { keywords } = inputs;
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  await context.evaluate(async (keywords) => {
    const catElement = document.createElement('div');
    catElement.id = 'pd_search_term';
    catElement.textContent = keywords;
    catElement.style.display = 'none';
    document.body.appendChild(catElement);
  }, keywords);
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
    country: 'FI',
    store: 'kauppahalli24',
    domain: 'kauppahalli24.fi',
    url: 'https://www.kauppahalli24.fi/',
    loadedSelector: 'nav[class*="navigation"]',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
