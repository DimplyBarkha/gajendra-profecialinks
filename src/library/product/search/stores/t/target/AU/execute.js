
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'target',
    domain: 'target.com.au',
    url: 'https://www.target.com.au/search?text={searchTerms}',
    loadedSelector: 'div.product-listing ul li:nth-last-child(1)',
    noResultsXPath: '//div[contains(@class,"ga-no-results")]//h3',
    zipcode: '',
  },
};
