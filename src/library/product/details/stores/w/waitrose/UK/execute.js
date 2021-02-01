const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  const searchPage = await context.evaluate(async () => { return document.querySelectorAll('article[data-test="product-pod"]').length; });
  if (searchPage === 1) {
    var detailsPage = await context.evaluate(async () => {
      if (document.querySelector('a[data-origincomponent="ProductPod"]') != null) {
        var productLink = document.querySelector('a[data-origincomponent="ProductPod"]').getAttribute('href');
      }
      return productLink;
    });
    if (detailsPage) {
      await context.goto('https://www.waitrose.com' + detailsPage);
      await context.waitForNavigation();
    }
  }
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
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"]',
    noResultsXPath: '//nav[@data-test="shop-windows"] | //div[@class="noResults___2M4HP"] | //h1[contains(text(), "404 Not Found")] | //ul[@style="margin-left:1.3em;margin-bottom:2em"] | //h1[contains(text(), "Offer(s)")] | //h1[@class="problem___1gdZ-"] | //pdf-viewer | //body[contains(text(), "PDF")] | //button[@aria-label="Load more"]',
    zipcode: '',
  },
  implementation,
};
