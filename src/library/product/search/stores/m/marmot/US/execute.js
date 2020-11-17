
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'marmot',
    domain: 'marmot.com',
    url: 'https://www.marmot.com/search?q={searchTerms}&search-button=&lang=default',
    loadedSelector: 'div.product-grid div.col-xxl-3',
    noResultsXPath: '//span[@class="search-result-count" and contains(text(),"Sorry, no product search results found")]',
    zipcode: "''",
  },
};
