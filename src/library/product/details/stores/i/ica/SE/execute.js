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

  try {
    //await context.click('button.gILNjb');
    await context.waitForSelector('input#zipcode');
    await context.setInputValue('input#zipcode',inputs.zipcode);
    await context.click('input#zipcode');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    //await context.waitForSelector('button[data-automation-id="store-selector-view-pickup"]');
    await context.click('button[data-automation-id="store-selector-view-pickup"]');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.click('button[data-automation-id*="store-selector-select-store"]');
    context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  }catch (e) {
    console.log(e);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));


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
    country: 'SE',
    store: 'ica',
    domain: 'ica.se',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '10316',
  },
  implementation,
};
