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

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  try{
    await context.waitForXPath('//div[contains(@data-comp,"HeroMediaList")]/div[1]//div[@data-hammer-carousel-inner="true"]//button/div[contains(@data-comp,"BccVideo")]',{timeout:1000});
    await context.click('//div[contains(@data-comp,"HeroMediaList")]/div[1]//div[@data-hammer-carousel-inner="true"]//button/div[contains(@data-comp,"BccVideo")]',{timeout:500});
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
////div[@data-comp="HeroMediaList "]/div[1]//div[@data-hammer-carousel-inner="true"]//button
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    domain: 'sephora.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  
};
