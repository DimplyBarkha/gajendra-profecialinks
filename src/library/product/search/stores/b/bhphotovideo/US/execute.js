async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  keywords = keywords.replace('/ /g', '+');
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ url: destinationUrl, zipcode });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const categoryMenu = await context.evaluate(async () => {
    if (document.querySelector('div[data-id="shop-by-type"], div[data-selenium="categoryGroupBlock"], main[class="main_2ptI9tdT0Li9Do3CQ0DcKn"]')) {
      return 'YES';
    }
  });
  if (categoryMenu) {
    const url1 = 'https://www.bhphotovideo.com/c/search?Ntt="{searchTerms}"&N=0&InitialSearch=yes&sts=ma';
    const destinationUrl1 = url1.replace('{searchTerms}', encodeURIComponent(keywords));
    await dependencies.goto({ url: destinationUrl1, zipcode });
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
    country: 'US',
    store: 'bhphotovideo',
    domain: 'bhphotovideo.com',
    url: 'https://www.bhphotovideo.com/c/search?Ntt={searchTerms}&N=0&InitialSearch=yes&sts=ma',
    loadedSelector: 'div[data-selenium="miniProductPage"]',
    noResultsXPath: '//h1[@class="title_2Tkgx8jFMHLoxqcKbZDI7v"] | //section[@class="body-404"] | //div[contains(text(), "We did not find any matches for ")]',
    zipcode: '',
  },
  implementation,
};
