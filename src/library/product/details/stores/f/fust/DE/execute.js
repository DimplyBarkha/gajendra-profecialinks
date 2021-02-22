/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });
  try {
    // await context.waitForSelector('input[name="SearchTerm"]');
    // await context.setInputValue('input[name="SearchTerm"]', inputs.keywords);
    await context.clickAndWaitForNavigation('div[class="product"] a[class="js-tealium-event-product-click"]');
  } catch (e) {
    console.log(e);
  }
  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'fust',
    domain: 'fust.ch',
    loadedSelector: 'div.productDetail',
    noResultsXPath: "//h1[contains(text(),'Seite nicht gefunden')]",
    zipcode: '',
  },
  implementation,
};
