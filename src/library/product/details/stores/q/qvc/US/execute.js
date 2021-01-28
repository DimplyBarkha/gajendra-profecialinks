const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (id) {
    id = id.toString().split('-')[0];
    await context.goto('https://www.qvc.com/');
    await context.setInputValue('input#txtMastheadSearch', id);
    await context.click('input[id="btnMastheadSearch"]');
    await context.waitForNavigation();
    url = await context.evaluate(async () => { return window.location.href; });
  }
  if (!url) {
    if (!id) throw new Error('No id provided');
  }
  await dependencies.goto({ url, zipcode, storeId });

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
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    loadedSelector: 'div[class*="container"], div[id="pageContent"]',
    noResultsXPath: '//div[@class="col-tn-12"]/ul/li | //li[@class="active"]/h1[contains(text(), "Sold Out")]',
    zipcode: '',
  },
  implementation,
};
