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
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  
  //await new Promise((resolve, reject) => setTimeout(resolve, 15000));
  try{
    await context.waitForSelector('input#zipcode');
    await context.setInputValue('input#zipcode',inputs.zipcode);
    await context.click('input#zipcode');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.click('button[data-automation-id="store-selector-view-pickup"]');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.click('button[data-automation-id="store-selector-select-store_13026"]');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  }catch(e){
    console.log(e);
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
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    domain: 'ica.se',
    url: 'https://www.ica.se/handla/sok/{searchTerms}',
    loadedSelector: 'ul.hZbUVv>li',
    noResultsXPath: '//ul[contains(@class,"hZbUVv")]/li',
    zipcode: '10316',
  },
  implementation,
};