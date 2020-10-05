async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    domain: 'foodservicedirect.com',
    loadedSelector: 'div[class*="page__content"] div[class*="c-product-viewer__content"], div[class*="c-product-card"]',
    noResultsXPath: '//div[contains(@class, "p-404-recommendation")]//div[contains(@class, "p-404-recommendation__content")]',
  },
  implementation,
};
