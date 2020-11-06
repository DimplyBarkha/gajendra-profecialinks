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
    await context.click("div[class='slick-initialized slick-slider'] a");
  }catch (e) {
    console.log(e);
  }  
  
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.us',
    loadedSelector: "h2[id='reviewsHeading']",
    noResultsXPath: "//h1//span[text()='Results Not Found']",
    zipcode: '',
  },
  implementation,
};
