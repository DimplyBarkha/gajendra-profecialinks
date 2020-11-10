
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'clicks',
    domain: 'clicks.co.za',
    url: 'https://clicks.co.za/search?q={searchTerms}',
    loadedSelector: 'div.wishplp',
    noResultsXPath: '//p[contains(text(),"Sorry,We found no results for")]',
    zipcode: '',
  },
};
