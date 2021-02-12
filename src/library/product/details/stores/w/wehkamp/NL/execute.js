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
    if (!builtUrl) return false; // graceful exit when not able to create a url
  }

  await dependencies.goto({ ...inputs, url: builtUrl || url });
  try {
    await context.click("div[class='H_j8WO position-relative'] button");
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
    country: 'NL',
    store: 'wehkamp',
    domain: 'wehkamp.nl',
    loadedSelector: 'div#content',
    noResultsXPath: "//div[@class='errorpage-content']//div[@class='errorpage-message']",
    zipcode: '',
  },
  implementation,
};
