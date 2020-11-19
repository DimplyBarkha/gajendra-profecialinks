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
  try{
    await context.waitForSelector('div.cookiecontent>div#c-right>a');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    await context.click('div.cookiecontent>div#c-right>a');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){

  }
  try{
    await context.waitForSelector('div.red-nov-modal__close');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    await context.click('div.red-nov-modal__close');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){
    
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
    country: 'AT',
    store: 'shop-apotheke',
    domain: 'shop-apotheke.com',
    url: 'https://www.shop-apotheke.com/search.htm?q={searchTerms}',
    loadedSelector: 'div#algolia-instant-search',
    noResultsXPath: '//div[contains(@class,"l-grid") and contains(@class,"u-margin--bottom")]//p[contains(text(),"Leider konnten wir keine passenden Produkte zu")]',
    zipcode: '',
  },
  implementation,
};
