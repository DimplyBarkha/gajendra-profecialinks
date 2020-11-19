
/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  //await context.evaluateInFrame('iframe', () => grecaptcha.execute());

  await dependencies.goto({ 
    url, zipcode: inputs.zipcode,
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
    antiCaptchaOptions: {
      type: 'RECAPTCHA',
    },
   });
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
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
    store: 'shoplet',
    domain: 'shoplet.com',
    url: 'https://www.shoplet.com/{searchTerms}/usrch',
    loadedSelector: 'div.padTop30',
    noResultsXPath: '//h2[text()="There were no results for your search."]',
    zipcode: '',
  },
  implementation,
};
