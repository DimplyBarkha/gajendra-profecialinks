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
  let { url, id, zipcode, storeId } = inputs;
  console.log(inputs)
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  try{
    await context.waitForSelector('div#onetrust-button-group>div>button',{timeout:1000});
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.click('div#onetrust-button-group>div>button',{timeout:500});
  }catch(e){

  }
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 13000));
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    domain: 'marionnaud.ch',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};
