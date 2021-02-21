async function implementation (
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

  await context.evaluate(async function () {
    // const custom_date = date;
    const customDate = '2020-01-01';
    if (customDate) {
      const custDate = document.querySelector('meta[itemprop="brand"]');
      if (custDate) {
        custDate.setAttribute('custom_date', customDate);
      }
    }
  });

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

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    return document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    domain: 'snusbolaget.se',
    loadedSelector: 'div.product-page',
    noResultsXPath: '//*[contains(text(),"Ojdå! Tyvärr kunde inte sidan hittas.")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
