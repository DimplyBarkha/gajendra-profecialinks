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
    await context.waitForSelector('section[class*="products-grid"] article a');
    await context.click('section[class*="products-grid"] article a');
    await context.waitForXPath('//div[contains(@class, "price-container")]//span[@itemprop="price"]');
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    domain: 'santediscount.com',
  },
  implementation,
};
