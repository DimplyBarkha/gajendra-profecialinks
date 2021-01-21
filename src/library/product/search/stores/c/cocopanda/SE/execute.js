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
    await context.waitForSelector('button[aria-label="Accepter alle"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.click('button[aria-label="Accepter alle"]');
  }catch(e){

  }
  
  try{
    await context.waitForSelector('div.vex-close');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.click('div.vex-close');
  }catch(e){
    //
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  
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
    store: 'cocopanda',
    domain: 'cocopanda.se',
    url: 'https://www.cocopanda.se/search?SearchTerm={searchTerms}',
    loadedSelector: 'main#main-container',
    noResultsXPath: '//main[@id="main-container"]//div[@class="main-content"]/h1[contains(text(),"Vi hittade tyvärr inga produkter som matchar din sökning efter")]',
    zipcode: '',
  },
  implementation,
};
