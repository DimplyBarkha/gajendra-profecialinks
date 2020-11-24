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
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  try {
    await context.click("div[class='region-selector'] ul[class='region-selector__regions-list'] li:nth-of-type(1) button");
  }catch (e) {
    console.log(e);
  }
  
  
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'nofrills',
    domain: 'nofrills.ca',
    loadedSelector: 'div[class="product-image-list__item product-image-list__item--product-details-page product-image-list__item--0"] img',
    noResultsXPath: null,//'//h2[@class="server-error-message__title"]',
    zipcode: '',
  },
  implementation,
};
