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
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  try{
    await context.waitForSelector('div.cookie-dialog-screen button.cookie-consent-accept');
    await context.click('div.cookie-dialog-screen button.cookie-consent-accept');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){

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
    country: 'FI',
    store: 'stockmann',
    domain: 'stockmann.com',
    loadedSelector: 'div.main-detail-block',
    noResultsXPath: "/html/body[not(//div[@data-action='Product-Show'])] | //h2[contains(text(),'Palaa takaisin etusivulle. Voit yrittää myöhemmin uudestaan')]",
    zipcode: '',
  },
  implementation
};
