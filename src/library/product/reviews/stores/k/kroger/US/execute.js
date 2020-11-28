/* async function implementation(
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const patternReplace = () => {
    if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = reviewUrl;
    if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    return tempUrl;
  };
  const destinationUrl = url || patternReplace();

  await dependencies.goto({ url: destinationUrl, zipcode });

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  await context.waitForXPath("//li[@itemprop='review']", { timeout: 10000 })
    .catch( ()=> console.log('waited for reviews to load, none found '));

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
} */

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    loadedSelector: '#BVRRContainer',
    noResultsXPath: '//*[@id="ratings-summary"][contains(@aria-label,"No rating value")] | //div[@id="notFound"] | //h2[contains(text(),"to have a bad link")] | //div[contains(@data-bv-show,"reviews") and (@class="hidden")]',
    reviewUrl: 'https://www.kroger.com/p/upc/{id}',
    sortButtonSelectors: '[aria-labelledby="bv-dropdown-select-reviews bv-dropdown-title-reviews"]|ul[id="bv-dropdown-select-reviews-sortby"] > li[data-bv-dropdown-value="mostRecent"]',
    zipcode: '',
  },
};
