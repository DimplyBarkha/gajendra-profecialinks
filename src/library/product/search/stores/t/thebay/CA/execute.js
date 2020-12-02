
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    domain: 'thebay.com',
    url: 'https://www.thebay.com/search?q={searchTerms}',
    loadedSelector: 'div.row.product-grid',
    noResultsXPath: '//*[contains(text(),"We weren’t able to find any results for")]',
    zipcode: '',
  },
};
