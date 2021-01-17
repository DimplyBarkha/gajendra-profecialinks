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
    await dependencies.goto({ ...inputs, url: builtUrl || url });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    
    try{
      console.log('comming for xpath');
      await context.waitForSelector('div#results-boxes>a',{timeout:500});
      console.log('comming for click');
      //await context.click('div#results-boxes>a',{timeout:500});
      //context.waitForNavigation();
      await context.clickAndWaitForNavigation('div#results-boxes>a');
    }catch(e){

    }
  }else{
    await dependencies.goto({ ...inputs, url: builtUrl || url });
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
    country: 'IL',
    store: 'super-pharm',
    domain: 'super-pharm.co.il',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};