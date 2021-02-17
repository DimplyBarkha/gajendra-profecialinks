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

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    return document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    domain: 'argos.co.uk',
    loadedSelector: 'h2[data-test*="product-name"]',
    noResultsXPath: 'boolean(//button[@data-test="reviews-accordion-button-toggle"])',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
