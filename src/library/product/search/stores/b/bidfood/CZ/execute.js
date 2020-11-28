const { Context } = require("mocha");

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
    await context.waitForSelector('input#ProductsSearchControl_SearchTextBoxProd');
    await context.setInputValue('input#ProductsSearchControl_SearchTextBoxProd',inputs.keywords);
    await context.waitForSelector('input#ProductsSearchControl_SearchButton[type="image"]');
    await context.click('input#ProductsSearchControl_SearchButton[type="image"]');
    await context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  }catch(e){

  }
  
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 100000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 9000));
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
    country: 'CZ',
    store: 'bidfood',
    domain: 'mujbidfood.cz',
    url: 'https://www.mujbidfood.cz/ItemListSearch.aspx?search={searchTerms}',
    loadedSelector: 'div#ContentPlaceHolder1_ctrlListControl_myDivMain',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
