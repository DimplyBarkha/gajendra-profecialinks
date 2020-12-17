
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    url: 'https://www.bestbuy.com/site/searchpage.jsp?st={searchTerms}&intl=nosplash',
    loadedSelector: 'li.sku-item[data-sku-id]',
    noResultsXPath: '//h3[@class="no-results-message"]',
    zipcode: "''",
  },
};
