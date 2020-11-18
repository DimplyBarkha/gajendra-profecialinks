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

  let scrollTop = 0;
  while (scrollTop !== 20000) {
    await stall(500);
    scrollTop += 1000;
    const oldScroll = await context.evaluate(() => { return document.querySelector('.quicksearch-scrolling-container').scrollHeight; });
    await context.evaluate(() => { document.querySelector('.quicksearch-scrolling-container').scrollBy(0, document.querySelector('.quicksearch-scrolling-container').scrollHeight + 1000); });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const newScroll = await context.evaluate(() => { return document.querySelector('.quicksearch-scrolling-container').scrollHeight; });
    if (newScroll === oldScroll || scrollTop === 20000) {
      await stall(5000);
      break;
    }
  }
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
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
    country: 'AU',
    store: 'jbhifi',
    domain: 'jbhifi.com.au',
    url: 'https://www.jbhifi.com.au/?q={searchTerms}',
    loadedSelector: 'div#quicksearch-search-results div.ais-hits--item',
    noResultsXPath: '//div[@id="MainContent_products_jbProductListNoResults_noResult"]',
    zipcode: "''",
  },
  implementation,
};
