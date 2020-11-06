
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
  let gotoParum={
    url, zipcode: inputs.zipcode,
    firstRequestTimeout: 60000,
     waitUntil: 'load',
     checkBlocked: false,
     antiCaptchaOptions: {
       type: 'HCAPTCHA',
     },
  };
  //await context.evaluateInFrame('iframe', () => grecaptcha.execute());
  await context.evaluate('iframe',()=>hcaptcha.execute());
  await dependencies.goto(gotoParum);
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
    country: 'BR',
    store: 'farmadelivery',
    domain: 'farmadelivery.com.br',
    url: 'https://www.farmadelivery.com.br/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div#algolia_instant_selector div#algolia-right-container',
    noResultsXPath: null,
    zipcode: '',
  },
};
