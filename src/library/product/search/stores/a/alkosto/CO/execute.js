
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    domain: 'alkosto.com',
    url: 'https://www.alkosto.com/salesperson/result/?q={searchTerms}',
    loadedSelector: 'div.toolbar',
    noResultsXPath: '//div[@class="contenedor elementos"]',
    zipcode: '',
  },
  implementation,
};
