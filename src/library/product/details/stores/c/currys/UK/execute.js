
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    loadedSelector: '#product-info',
    noResultsXPath: '//p[contains(text(), "No results were found for your search.")]',
    zipcode: '',
  },
  implementation: async (
    { id },
    { domain, loadedSelector, noResultsXPath },
    context,
    dependencies,
  ) => {
    const timeout = 30000;

    await context.goto(domain, { timeout, waitUntil: 'networkidle0' });
    await context.waitForSelector('input[name="search-field"]', { timeout });
    await context.setInputValue('input[name="search-field"]', id);
    await context.click('form[class*="HeaderSearchProduct__SearchFieldset"] button');
    await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
    try {
      await context.waitForSelector(loadedSelector, { timeout });
    } catch (err) {
      throw new Error('Product not found');
    }
  }
};
