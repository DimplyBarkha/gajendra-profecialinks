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
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  try {
    await context.click('div.snrs-modal-btn-close');
  }catch (e) {
    console.log(e);
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
    store: 'komputronik',
    domain: 'komputronik.pl',
    url: 'https://www.komputronik.pl/search/category/1?query={searchTerms}',
    loadedSelector: 'ul.product-entry2-wrap',
    noResultsXPath: '//div[contains(text(),"Nie znaleziono produktów spełniających podane kryteria.")]',
    zipcode: "''",
  },
  implementation,
};
