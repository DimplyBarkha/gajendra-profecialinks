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
  // Check for redirection.
  const redirected = await context.evaluate(() => {
    return window.location.pathname !== '/CatalogSearch';
  });

  // If redirected select LG brand filter
  if (redirected) {
    const brandFilterUrl = await context.evaluate(() => {
      return document.querySelector('[name="LG"]') ? document.querySelector('[name="LG"]').parentElement.href : '';
    });
    if (brandFilterUrl) {
      await dependencies.goto({ url: brandFilterUrl, zipcode: inputs.zipcode });
    } else {
      return false;
    }
  }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const rows = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, rows);
    const element = rows.iterateNext();
    console.log(element);
    return !element;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'costco_lg',
    domain: 'costco.com',
    url: 'https://www.costco.com/CatalogSearch?brand=lg&keyword={searchTerms}&refine=ads_fbrand_ntk_cs:"LG"|',
    loadedSelector: 'div.thumbnail p.description',
    noResultsXPath: '//div[@id="no-results"][contains(.,"Try Another Search")]',
  },
  implementation,
};
