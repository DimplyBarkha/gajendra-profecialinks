async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const primeZipCode = parameters.store.match(/\d{5}/g)[0];

  context.primeZipCode = () => primeZipCode;

  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url });
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
    country: 'US',
    store: 'amazonPrimeNow75204',
    domain: 'primenow.amazon.com',
    url: 'https://primenow.amazon.com/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL',
    loadedSelector: 'li.product_grid__item__1eRlB',
    noResultsXPath: 'div.index__shopAmazon__12-0r',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation
};
