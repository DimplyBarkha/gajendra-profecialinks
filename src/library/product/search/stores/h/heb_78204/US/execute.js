
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    domain: 'heb.com',
    url: 'https://www.heb.com/search/?q={searchTerms}',
    loadedSelector: 'nav.paging-container',
    noResultsXPath: '//h1[contains(text(),"No results found for")]',
    zipcode: '78204',
  },
};
