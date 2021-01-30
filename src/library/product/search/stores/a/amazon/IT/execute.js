async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const destinationUrl = url.replace(/{searchTerms}/g, encodeURIComponent(keywords));
  await dependencies.goto({ ...inputs, url: destinationUrl });

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
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/s?k={searchTerms}&rh=n%3A1571289031%2Cp_89%3A{searchTerms}',
    loadedSelector: 'div.s-main-slot',
    noResultsXPath: '//span[contains(@class,"messaging-messages-no-results")]',
    zipcode: '',
  },
  implementation,
};
