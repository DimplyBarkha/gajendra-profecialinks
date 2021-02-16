async function implementation ({ url, id }, { reviewUrl, noResultsXPath }, context, dependencies) {
  const patternReplace = () => {
    if (reviewUrl) {
      let tempUrl = reviewUrl;
      if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
      return tempUrl;
    }
  };
  const destinationUrl = patternReplace();
  await dependencies.goto({ url: destinationUrl });

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
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"]',
    noResultsXPath: '//div[@class="bv-content-placeholder"] | //button[@aria-label="Load more"]',
    reviewUrl: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
