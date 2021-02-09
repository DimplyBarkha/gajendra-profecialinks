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
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  try{
    await context.waitForSelector('button[data-testid="cookie-popup-accept"]');
    await context.click('button[data-testid="cookie-popup-accept"]');
  }catch(e){

  }
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
    country: 'BE',
    store: 'delhaize_fr',
    domain: 'delhaize.be',
    loadedSelector: null,
    noResultsXPath: '//div[@class="ErrorPage ContentTemplate pageBody"]/h1[text()="Désolé, une erreur est survenue. Veuillez vérifier le formulaire et réessayer."]/text()',
    zipcode: '',
  },
  implementation
};
