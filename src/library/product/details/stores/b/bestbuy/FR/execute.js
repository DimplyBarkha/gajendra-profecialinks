/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    domain: 'bestbuy.ca',
    loadedSelector: 'div[class*="product-detail"]',
    noResultsXPath: '//div[@id="french-container"]',
    zipcode: '',
  },
};
