/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ url: destinationUrl, zipcode });

  try {
    await context.click('div.pecr-cookie-banner-content__buttons-pG9aE button[data-test="allow-all"]');
  } catch (e) {
    console.log(e);
  }

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    url: 'https://www.johnlewis.com/search?search-term={searchTerms}',
    loadedSelector: '.PLP_plp__3vv2c',
    noResultsXPath: '/html[not(//title[contains(.,"Search results")])] | //h1[contains(text(),"Sorry, we couldn\'t find any results")]',
    zipcode: '',
  },
  implementation,
};
