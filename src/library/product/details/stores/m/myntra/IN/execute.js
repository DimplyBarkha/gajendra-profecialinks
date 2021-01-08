/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  try {
    await context.click('div[class="index-showMoreText"]');
  }catch (e) {
    console.log(e);
  }
  try {
    await context.click('div[class="supplier-viewmore-link"]');
  }catch (e) {
    console.log(e);
  }  
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    domain: 'myntra.com',
    loadedSelector: "div[class='image-grid-container common-clearfix'] div[class='image-grid-imageContainer'] div[class='image-grid-image']",
    noResultsXPath: "//span[text()='Sorry, this page is temporarily unavailable.']",
    zipcode: '',
  },
  implementation,
};
