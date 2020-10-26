
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'rei',
    domain: 'rei.com',
    url: 'https://www.rei.com/search?q={searchTerms}',
    loadedSelector: 'div#search-results',
    noResultsXPath: "//p[contains(text(),'Sorry, we couldn’t find any matches')]",
    zipcode: '',
  },
};
