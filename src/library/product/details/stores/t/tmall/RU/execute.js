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
    //await context.click('button#wzrk-cancel');
    await context.click('a.next-dialog-close');
  }catch (e) {
    console.log(e);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

  try {
    //await context.click('button#wzrk-cancel');
    await context.click('div#product-detail li[ae_button_type="tab_specs"]');
  }catch (e) {
    console.log(e);
  }
   new Promise((resolve, reject) => setTimeout(resolve, 25000));

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
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    loadedSelector: 'div.product-main',
    noResultsXPath: '//div[@class="page-not-found"]',
    zipcode: "''",
  },
  implementation,
};
