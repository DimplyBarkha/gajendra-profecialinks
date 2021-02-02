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
    await context.waitForSelector('div.VerifyCityModal__Actions>button.ButtonNext_Theme-Alpha');
    await context.click('div.VerifyCityModal__Actions>button.ButtonNext_Theme-Alpha');
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
  }catch(e){
    console.log('........................not popup..........................');
  }
  try{
    console.log('comming for xpath');
    await context.waitForSelector('a.ProductCard-Content');
    console.log('comming for click');
    let tmphref= await context.evaluate(function(){
      return document.querySelector('a.ProductCard-Content').href;
    });
    console.log('tmphref:',tmphref);
    await context.goto(tmphref);
    await context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  }catch(e){
    console.log('................................commint to error..................');
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
    country: 'KZ',
    store: 'technodom',
    domain: 'technodom.kz',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
