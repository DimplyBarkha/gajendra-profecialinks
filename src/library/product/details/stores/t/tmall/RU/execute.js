/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation(
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
<<<<<<< HEAD
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  
=======
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

>>>>>>> eddac141d99df19d31f64d42dab9522990b75a42

  try {
    await context.waitForSelector('div#product-detail li[ae_button_type="tab_specs"]');
    //await context.click('div#product-detail li[ae_button_type="tab_specs"]',{timeout:1000});
    await context.evaluate(function () {
      document.querySelector('div#product-detail li[ae_button_type="tab_specs"]').click();
    })
<<<<<<< HEAD
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch (e) {
=======
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  } catch (e) {
>>>>>>> eddac141d99df19d31f64d42dab9522990b75a42
    console.log(e);
  }
  try {
    const deleteiFrame = await context.evaluate(async function () {
      const iFrameXPath = 'iframe[src^="https://campaign.aliexpress.com/wow/gcp/"]';
      document.querySelector(iFrameXPath).remove();
    })
  } catch (e) {

  }
  try {
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // TODO: Check for not found?
  } catch (e) {
    console.log("error");
  }
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
