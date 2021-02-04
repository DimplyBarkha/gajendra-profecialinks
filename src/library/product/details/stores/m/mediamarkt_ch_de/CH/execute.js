
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    domain: 'mediamarkt.ch',
    loadedSelector: 'aside#product-sidebar img',
    noResultsXPath: '//div[contains(@id, "search_no_result")] | //h1[contains(text(), "404")] | //div[contains(@class, "outer-brand")] | //span[@class="offline-text"]',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    let { url, id, zipcode, storeId } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }
    url = url.replace('/fr/', '/de/');
    await dependencies.goto({ url, zipcode, storeId });
    await context.waitForNavigation();
    const currentUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    if (currentUrl.includes('/fr/')) {
      url = currentUrl.replace('/fr/', '/de/');
      await dependencies.goto({ url, zipcode, storeId });
    }

    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  },
};
