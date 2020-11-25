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
  return await context.evaluate(function (xp, url) {
    localStorage.setItem('url', `${url}`);
    const rows = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, rows);
    const element = rows.iterateNext();
    console.log(element);
    return !element;
  }, parameters.noResultsXPath, url);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    domain: 'iga.net',
    url: 'https://www.iga.net/search?t={D9CE4CBE-C8C3-4203-A58B-7CF7B830880E}&k={searchTerms}',
    loadedSelector: null,
    noResultsXPath: "//h2[contains(@class,'h3-like')]/parent::div[@class='grid__item']",
    zipcode: '',
  },
  implementation,
};
