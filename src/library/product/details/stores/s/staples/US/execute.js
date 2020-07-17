/**
*
* @param { { url?: string,  id?: string} } inputs
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
  let { url, id } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url });
  try {
    await context.waitForSelector('input[id="searchInput"]');
    console.log('input field on home page loaded......');
    await context.setInputValue('input[id="searchInput"]', id);
    console.log('input field set......---------->', id);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.clickAndWaitForNavigation('button[class*="search-bar"]', {}, { timeout: 20000 });
    await context.waitForSelector('div[id="product_name"]');
    console.log('clicked on search button and details page loaded successfully........');
  } catch (e) {
    console.log('some error occured in interaction while going to product details page.........');
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'staples',
    domain: 'staples.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
