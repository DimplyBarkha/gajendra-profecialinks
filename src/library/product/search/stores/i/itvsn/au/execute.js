async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  
  //const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  //const url = parameters.url.replace(/{searchTerms}/g, encodeURIComponent(inputs.keywords));

  let urlVar = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords))
  const url = urlVar.replace('{searchTerms}', inputs.keywords.replace(/ /g,"+"));
  
  await dependencies.goto({ url, zipcode: inputs.zipcode });
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
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    domain: 'itvsn.com.au',
    //url: 'https://www.itvsn.com.au/search/{searchTerms}',
    url: 'https://www.itvsn.com.au/search/{searchTerms}?searchstring={searchTerms}',
    loadedSelector: 'div.tvsn-category-list',
    noResultsXPath: '//div[contains(@class,"row tvsn-category-list")]//div[contains(@class,"tvsn-category-empty")]',
    zipcode: '',
  },
  implementation
};
