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
  const { url, id, zipcode, storeId } = inputs;
  const { loadedSelector, noResultsXPath } = parameters;

  if (!url && !id) throw new Error('No id or url provided');
  const destinationURL = url || await dependencies.createUrl({ id });

  await dependencies.goto({ url: destinationURL, zipcode, storeId });
  await new Promise((resolve, reject) => setTimeout(resolve, 15000));
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  if (noResultsXPath) {
    return await context.evaluate((xp) => {
      const result = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      return !result;
    }, noResultsXPath);
  }
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    loadedSelector: 'div.css-186cfsd',
    noResultsXPath: "//h1[contains(text(),'Clean up in Aisle 404!')]",
    zipcode: '',
  },
  implementation,
};
