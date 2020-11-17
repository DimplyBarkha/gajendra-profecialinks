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
    await context.waitForSelector('button#onetrust-accept-btn-handler');
    await context.click('button#onetrust-accept-btn-handler');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){
    //
  }
  for(let i=0;i<5;i++){
    try{
      await context.waitForSelector('div.more-data-loader__footer>button.more-data-loader__btn');
      await context.click('div.more-data-loader__footer>button.more-data-loader__btn');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }catch(e){

    }
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
    country: 'AT',
    store: 'marionnaud',
    domain: 'marionnaud.at',
    url: 'https://www.marionnaud.at/search?text={searchTerms}',
    loadedSelector: 'div.container-fluid>div.more-data-loader > div.container-fluid, container-fluid--max-width',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};