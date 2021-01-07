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
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

  try {
    await context.waitForSelector('div#product-detail li[ae_button_type="tab_specs"]',{timeout:1500});
    await context.click('div#product-detail li[ae_button_type="tab_specs"]',{timeout:1000});
  }catch (e) {
    console.log(e);
  }
  
  try{
    const deleteiFrame=await context.evaluate(async function(){
      const iFrameXPath = 'iframe[src^="https://campaign.aliexpress.com/wow/gcp/"]';
      document.querySelector(iFrameXPath).remove();
    })
  }catch(e){

  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    loadedSelector: 'div.product-main',
    noResultsXPath: '//div[@class="page-not-found"]',
    zipcode: '',
  },
  implementation
};
