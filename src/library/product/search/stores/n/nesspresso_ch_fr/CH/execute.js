
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_fr',
    domain: 'nespresso.com',
    url: '',
    loadedSelector: 'div[class="sitemap__footer"]',
    noResultsXPath: '//div[@class="g_text"]/h2[contains(text(), "PARFOIS, ON SE PERD EN CHEMIN")]',
    zipcode: '',
  },
  implementation: async (
    { zipcode, keywords },
    { url, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    await dependencies.goto({ url: keywords, zipcode });

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
  },
};
