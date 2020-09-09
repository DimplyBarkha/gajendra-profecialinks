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
  try {
    await context.click('button#wzrk-cancel');
  }catch (e) {
    console.log(e);
  }
  try {
    await context.click('a.nmModal__close');
  }catch (e) {
    console.log(e);
  }  
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

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
    country: 'AE',
    store: 'namshi',
    domain: 'namshi.com',
    url: 'https://en-ae.namshi.com/?q={searchTerms}',
    loadedSelector: 'section#catalog_container',
    noResultsXPath: '//div[@id="section_404_container"]',
    zipcode: "''",
  },
  implementation,
};
