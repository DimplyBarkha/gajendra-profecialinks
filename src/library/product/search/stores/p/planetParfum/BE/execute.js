
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'planetParfum',
    domain: 'planetparfum.com',
    url: 'https://www.planetparfum.com/fr/searchresults?q={searchTerms}',
    loadedSelector: 'div.search-result-content',
    noResultsXPath: '//div[@class="no-hits-headline"]',
    zipcode: '',
  },
};
