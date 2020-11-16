async function implementation (inputs, parameters, context, dependencies) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  
  await context.goto(url);
  const isRightPage = await context.evaluate(async () => {
    return document.querySelector('div[class="container-fluid"]');
  });
  
  if (isRightPage != null) {
    const url1 = 'https://www.mecca.com.au/search?q="{searchTerms}"'.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await context.goto(url1);
   } 
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
};
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    domain: 'mecca.com.au',
    url: 'https://www.mecca.com.au/search?q={searchTerms}',
    loadedSelector: 'div[class="search-result-content"]',
    noResultsXPath: '//div[@class="no-hits-help"]',
    zipcode: '',
  },
  implementation,
};
