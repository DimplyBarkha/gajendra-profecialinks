module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GB',
    domain: 'groceries.asda.com',
    store: 'asda',
    url: 'https://groceries.asda.com/search/{searchTerms}',
    loadedSelector: 'div.co-product',
    noResultsXPath: '//div[@id="listingsContainer"]//div[contains(@class,"no-result")]',
  },
};
