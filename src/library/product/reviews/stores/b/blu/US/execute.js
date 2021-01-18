async function implementation (
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {

  await dependencies.goto({ url });

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div#__next',
    noResultsXPath: 'boolean(//div[@data-testid="review-post"])',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
