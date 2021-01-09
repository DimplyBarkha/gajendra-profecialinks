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
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  let secondURL='';
  try{
    await context.waitForSelector('div.moreInfoNonfoodPopup a',{timeout:1000});
    const hrefData= await context.evaluate(function(){
      const tmpHtml=document.querySelector('div.moreInfoNonfoodPopup a');
      return tmpHtml.href;
    })
    secondURL=hrefData;
    await dependencies.goto({ ...inputs, url: secondURL });
  }catch(e){
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
    country: 'IL',
    store: 'shufersal',
    domain: 'shufersal.co.il',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};
