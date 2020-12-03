
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    domain: 'newpharma.nl',
    url: 'https://www.newpharma.nl/search-results/index.html?key1={searchTerms}',
    loadedSelector: 'body[data-view]',
    noResultsXPath: '//span[@class="gtm-search-no-results"]',
    zipcode: "''",
  },
};
