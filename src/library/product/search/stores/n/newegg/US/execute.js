
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    domain: 'newegg.com',
    url: 'https://www.newegg.com/p/pl?d={searchTerms}',
    loadedSelector: 'div.items-grid-view > div > div > a img',
    noResultsXPath: '//span[@class="result-message-error"]',
    zipcode: "''",
  },
};
