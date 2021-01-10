
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'azrieli',
    domain: 'azrieli.com',
    url: 'https://www.azrieli.com/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"homePageTop")] | //div[contains(@class,"notFoundMsg")]',
    zipcode: '',
  },
};
