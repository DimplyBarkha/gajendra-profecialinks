/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  { zipcode, keywords },
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({
    url: destinationUrl,
    zipcode: zipcode,
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
    antiCaptchaOptions: {
      type: 'RECAPTCHA',
    },
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

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
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    url: 'https://super.walmart.com.mx/productos?Ntt={searchTerms}',
    loadedSelector: 'div.infinite-scroll-component__outerdiv',
    noResultsXPath: '//div[contains(@class,"no-results_container__")]//h2[contains(text(),"¡Lo sentimos!")]',
    zipcode: '',
  },
  
};
