/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  'use strict';
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  //button[aria-label="Accepter alle"]
  //await context.waitForXPath('//button[@aria-label="Accepter alle"]', { timeout: 30000 });
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
  
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));  

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'cocopanda',
    domain: 'cocopanda.dk',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
