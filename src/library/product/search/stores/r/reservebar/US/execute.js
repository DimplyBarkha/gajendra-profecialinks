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
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  return await context.evaluate(function (xp, inputs) {
    localStorage.setItem('keywords', `${inputs.keywords}`);
    const rows = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, rows);
    const element = rows.iterateNext();
    console.log(element);
    return !element;
  }, parameters.noResultsXPath, inputs);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    domain: 'reservebar.com',
    url: 'https://www.reservebar.com/search?q={searchTerms}',
    loadedSelector: 'ul.grid--view-items  li:first-child img',
    noResultsXPath: '//div[@id="category"]//h1',
    zipcode: '',
  },
  implementation,
};
