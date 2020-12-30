module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    url: 'https://www.bestbuy.com/site/searchpage.jsp?st={searchTerms}',
    loadedSelector: 'ol.sku-item-list',
    noResultsXPath: "//div[@class='no-results-copy']",
    zipcode: '',
  },
};
