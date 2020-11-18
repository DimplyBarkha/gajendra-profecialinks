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
    await context.click('div#currency-autoswitch-toggle');
    await context.clickAndWaitForNavigation('a[data-code="SAR"]'); 
  } catch (error) {
    console.log(error);
  }

  await dependencies.goto({ url, zipcode: inputs.zipcode });

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
    country: 'SA',
    store: 'mumzworld',
    domain: 'mumzworld.com',
    url: 'https://saudi.mumzworld.com/sa-en/#search={searchTerms}&page=0&minReviewsCount=0&minPrice=0&curmaxPrice=99999&refinements=%5B%5D',
    loadedSelector: 'ul[class *="products-grid"]',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
