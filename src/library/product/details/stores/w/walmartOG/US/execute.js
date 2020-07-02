
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    domain: 'grocery.walmart.com',
    loadedSelector: 'div[data-automation-id="productPageTile"] div[class*="imageContainer"] img[data-automation-id="image"] , div[data-automation-id="productPageTile"] div[class*="imageContainer"] img[data-tl-id="ProductPage-primary-image"]',
    noResultsXPath: '(//*[@id="shoppingContent"]//section[contains(@class,"ProductPage__errorContainer")]|//*[@id="shoppingContent"]//*[@data-automation-id="noResultsSearchTerm"])[1]|//div[contains(@class, "_404__container")]',
  },
};
