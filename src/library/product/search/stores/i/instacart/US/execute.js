async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords, query, storeId } = inputs;
  console.log(url);
  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{storeId}', storeId)
    .replace('{queryParams}', query);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log(`noResultsXPath: ${noResultsXPath}`);
  return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'instacart',
    domain: 'instacart.com',
    url: 'https://www.instacart.com/store/{storeId}/search_v3/{searchTerms}',
    // loadedSelector: null,
    loadedSelector: 'div[class^="items-list"]',
    noResultsXPath: null,
    // noResultsXPath: '//h3[contains(@class, "error-inline")]',
    zipcode: '',
  },
  implementation,
};
