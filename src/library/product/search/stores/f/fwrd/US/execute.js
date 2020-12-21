async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  
  const { keywords } = inputs;
  const destinationUrl = url.replace('{queryParams}', keywords);
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


module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    domain: 'fwrd.com',
    url: 'https://www.fwrd.com/{queryParams}/?navsrc=main&sortBy=popularity',
    loadedSelector: '#plp-product-list ul.product-grids li',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
