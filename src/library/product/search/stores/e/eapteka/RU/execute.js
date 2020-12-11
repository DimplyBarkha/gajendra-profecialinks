
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    domain: 'eapteka.ru',
    url: 'https://www.eapteka.ru/search/?q={searchTerms}&utm_referrer=',
    loadedSelector: 'section.cc-item div.cc-item--img img',
    noResultsXPath: '//div[@class="container"]//h1[contains(.,"По запросу")] | //div[@class="sec-error"] | /html[@lang and not(//section[@class="cc-item"])]',
    zipcode: '',
  },
  implementation: async (
    { zipcode, keywords },
    { url, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
    await dependencies.goto({ url: destinationUrl, zipcode });

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    if (loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 20000 }, loadedSelector, noResultsXPath);
    }
    console.log('Checking no results', noResultsXPath);
    return await context.evaluate((xp) => {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, noResultsXPath);
  },
};
