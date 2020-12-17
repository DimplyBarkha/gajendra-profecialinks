async function implementation (
  { url, id, zipcode, date, days, Brands },
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

  // only want reviews of items matching input brand from search:
  if (Brands) {
    const onDesiredBrand = await context.evaluate((Brands) => {
      const BrandEl = document.querySelector('a#bylineInfo');
      return (BrandEl && BrandEl.textContent.toLowerCase().includes(Brands.toLowerCase()));
    }, Brands);
    if (!onDesiredBrand) {
      return false;
    }
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
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//span[contains(text(),"No customer reviews")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
