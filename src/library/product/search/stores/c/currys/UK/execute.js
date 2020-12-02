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
    await context.click('button#onetrust-accept-btn-handler');
  } catch (error) {
    console.log(error.message);
  }

  await context.waitForSelector('div.Header__Wrapper-ctQkEG > form input[name="search-field"]');
  await context.setInputValue('div.Header__Wrapper-ctQkEG > form input[name="search-field"]', inputs.keywords);
  await context.clickAndWaitForNavigation('div.Header__Wrapper-ctQkEG > form button[type="submit"]');

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
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    url: 'https://www.currys.co.uk',
    loadedSelector: 'div.resultList article.product',
    noResultsXPath: '//div[@class="product-page"]',
    zipcode: "''",
  },
  implementation,
};
