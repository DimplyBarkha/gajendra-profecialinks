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
    await context.click('button.cookie-consent-approve-all');
  } catch (e) {
    console.log(e);
  }

  try {
    await context.waitForSelector('input[name="SearchTerm"]');
    await context.setInputValue('input[name="SearchTerm"]', inputs.keywords);
    //await context.click('div.hidden-xs button[name="search"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.evaluate(async function () {
      document.querySelector('div.hidden-xs button[name="search"]') && document.querySelector('div.hidden-xs button[name="search"]').click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(e);
  }

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
    country: 'NL',
    store: 'hoogvliet',
    domain: 'hoogvliet.com',
    url: 'https://www.hoogvliet.com',
    loadedSelector: 'div.product-list div.product-list-item',
    noResultsXPath: '//div[@class="no-search-result"]',
    zipcode: "''",
  },
  implementation,
};
