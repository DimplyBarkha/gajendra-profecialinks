
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    domain: 'mimovrste.com',
    url: 'https://www.mimovrste.com/iskanje?s={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null, // '//div[@class="msg msg--indent-medium msg--warning"]',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    { url, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) {
    const { keywords, query } = inputs;
    console.log(url);
    const destinationUrl = url
      .replace('{searchTerms}', `${encodeURIComponent(keywords)}`)
      .replace('{queryParams}', `${encodeURIComponent(query)}`);
    await dependencies.goto({ ...inputs, url: destinationUrl });

    if (loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, loadedSelector, noResultsXPath);
    }
    console.log(`noResultsXPath: ${noResultsXPath}`);
    return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
  },
};
