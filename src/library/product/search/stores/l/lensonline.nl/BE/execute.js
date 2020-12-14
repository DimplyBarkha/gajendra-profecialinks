
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'lensonline.nl',
    domain: 'lensonline.nl',
    url: 'https://www.lensonline.nl/nl/search/0/{searchTerms}/?s={searchTerms}&c=All',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
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
}
