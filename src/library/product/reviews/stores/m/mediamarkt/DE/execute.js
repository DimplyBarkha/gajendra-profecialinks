
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    loadedSelector: 'section#reviews',
    noResultsXPath: '//div[contains(@class, "ErrorPagestyled__StyledErrorHeadingWrapper")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation: async (
    { url, id, zipcode, date, days },
    { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
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

    const isCookieModalPresent = await context.evaluate(async () => {
      return document.querySelector('button#privacy-layer-accept-all-button') !== null;
    });
    if (isCookieModalPresent) {
      await context.click('button#privacy-layer-accept-all-button');
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
