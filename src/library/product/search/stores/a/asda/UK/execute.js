module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    url: 'https://groceries.asda.com/search/{searchTerms}',
    loadedSelector: 'div.search-page-content__products-tab-content li.co-item:nth-last-child(1) div.co-product img',
    noResultsXPath: '//div[@id="listingsContainer"]//div[contains(@class,"no-result")]',
  },
};
