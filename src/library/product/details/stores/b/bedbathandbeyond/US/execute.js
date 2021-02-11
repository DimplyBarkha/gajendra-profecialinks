/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl} } dependencies
 */
async function implementation (
  inputs,
  { loadedSelector, noResultsXPath },
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
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  try {
    await context.click("div[class='slick-initialized slick-slider'] a");
  }catch (e) {
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

}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathandbeyond',
    domain: 'bedbathandbeyond.com',
    loadedSelector: "div[class^='ProductDetailsLayout'] h1",
    noResultsXPath: "//h1//span[text()='Results Not Found']|//main[@role='main']//div[@class='cmsContent']|//img[contains(@alt, 'Beyond Plus')]",
    zipcode: '',
  },
  implementation,
};
