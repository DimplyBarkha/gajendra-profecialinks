async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  const responseStatus = await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: 50000,
    waitUntil: 'load',
    checkBlocked: false,
  });

  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // API to fetch product details
  await context.evaluate(async function (url) {
    async function getData (url = '') {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        },
      });
      return response.json();
    };

    const productDetails = await getData(url);
    console.log('Number of products loaded' + productDetails.products.length);
    // @TODO - Append the details to DOM
  }, url );

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
    country: 'SE',
    store: 'alloffice',
    domain: 'alloffice.se',
    url: 'https://www.alloffice.se/sok?q={searchTerms}&count=150',
    loadedSelector: 'a[data-test-id="product-link"]',
    noResultsXPath: '//div[contains(.,"sökning gav inga träffar")]',
    zipcode: '',
  },
  implementation,
};
