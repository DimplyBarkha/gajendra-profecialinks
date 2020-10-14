
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
    await context.click('div#expandable-section-1');
  }catch (e) {
    console.log(e);
  }
  try {
    await context.click('div#expandable-section-2');
  }catch (e) {
    console.log(e);
  }
  try {
    await context.click('div#expandable-section-3');
  }catch (e) {
    console.log(e);
  }
  try {
    await context.click('div#expandable-section-4');
  }catch (e) {
    console.log(e);
  }
  
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    domain: 'bell.ca',
    loadedSelector: 'div[class="dd-info-reviews-stars"] button[id="ratings-summary"]',
    noResultsXPath: '//main[@class="rsx-page-content error-page"]',
    zipcode: '',
  },
  implementation,
};
